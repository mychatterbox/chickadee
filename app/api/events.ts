import { type Context, type Env, Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { cors } from "hono/cors";
import { UAParser } from "ua-parser-js";
import { getConnInfo } from "hono/cloudflare-workers";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import { toAnalyticsEngineDataPoint, type IDataPoint } from "../lib/datapoint";

// To identify unique visitor count: hash(daily salt + domain + IP + user agent + accept language)
// inspired by: https://plausible.io/data-policy#how-we-count-unique-users-without-cookies

const app = new Hono<Env>();

// cors
app.use(
  cors({
    origin: "*", // allow all origins
    allowMethods: ["OPTIONS", "GET", "POST"],
  })
);

// POST events
app.post(
  "/",
  zValidator(
    "json",
    z.object({
      e: z.string().describe("Event Name").optional().default("view"),
      d: z.string().describe("Domain"),
      u: z.string().url().describe("URL"),
      r: z.string().describe("Referrer").optional(),
      w: z.number().describe("Screen Width in px").optional(),
      t: z.number().describe("Load Time in ms").optional(),
      uid: z.string().describe("User ID").optional(), // TODO allow setting uid (requires consent)
    })
  ),
  async (c) => {
    try {
      // Request Body
      const {
        e: evt,
        d: sid,
        u,
        r: ref,
        w: width,
        t: loadTime,
        uid,
      } = c.req.valid("json");
      const url = new URL(u);

      // HonoRequest: https://hono.dev/docs/api/request
      const acceptLanguage = c.req.header("Accept-Language");
      const locales = acceptLanguage ? parseAcceptLanguage(acceptLanguage) : [];
      const locale = locales.length > 0 ? locales[0] : null;
      const userAgent = c.req.header("User-Agent");
      const ua = userAgent ? UAParser(userAgent) : null;

      // CF Request Properties: https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
      const cf = c.req.raw.cf as IncomingRequestCfProperties | undefined;
      // CF Bot Management: https://developers.cloudflare.com/bots/concepts/bot-score/
      const isBot =
        cf &&
        (cf.botManagement.verifiedBot ||
          (cf.botManagement.score > 0 && cf.botManagement.score < 30));

      // Connection Info
      const info = getConnInfo(c);
      const ip = info.remote.address;

      // Daily Visitor Hash
      const salt = await getDailySalt(c);
      const hashInput =
        ip && userAgent ? [salt, sid, ip, userAgent, acceptLanguage] : null;
      const dailyVisitorHash = hashInput
        ? await hash(hashInput.join(":"))
        : null;

      // Build data point
      const data: IDataPoint = {
        sid,
        evt,
        ref: ref ?? null,
        path: url.pathname,
        hash: url.hash,

        // Location
        country: cf?.country ?? null,
        region: cf?.region ?? null,
        city: cf?.city ?? null,
        timezone: cf?.timezone ?? null,

        // headers
        browser: ua?.browser.name ?? null,
        browserVersion: ua?.browser.version ?? null,
        os: ua?.os.name ?? null,
        osVersion: ua?.os.version ?? null,
        device: ua ? ua.device.type ?? "desktop" : null, // default to desktop: https://github.com/faisalman/ua-parser-js/issues/182
        locale,

        // UTM
        utmSource: url.searchParams.get("utm_source"),
        utmCampaign: url.searchParams.get("utm_campaign"),
        utmMedium: url.searchParams.get("utm_medium"),

        // User
        dailyVisitorHash,
        uid: uid ?? null,

        // Metrics
        width: width ?? null,
        loadTime: loadTime ?? null,

        // Flags
        isBot: isBot ?? null,
      };

      // Write data point to Analytics Engine.
      // * Limits: https://developers.cloudflare.com/analytics/analytics-engine/limits/
      if (c.env.ENGINE)
        c.env.ENGINE.writeDataPoint(toAnalyticsEngineDataPoint(data));
      else console.info("EVENT", data);

      return c.text("ok", 200);
    } catch (err) {
      console.error(err);
      return c.text("Internal Server Error", 500);
    }
  }
);

// helpers

function getMidnight() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

const DAILY_SALT_KEY = "SALT";

async function getDailySalt(c: Context<Env>) {
  const salt = await c.env.KV.get(DAILY_SALT_KEY);
  if (salt) return salt;

  // Generate new salt, expire at end-of-day
  const newSalt = crypto.randomUUID();
  const expiration = Math.floor(getMidnight().getTime() / 1000) + 86400;
  await c.env.KV.put(DAILY_SALT_KEY, newSalt, { expiration });
  return newSalt;
}

async function hash(input: string): Promise<string> {
  // hash input
  const digest = await crypto.subtle.digest(
    { name: "SHA-256" },
    new TextEncoder().encode(input)
  );
  // convert to base64 string
  const hashed = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return hashed;
}

// export
export default app;
