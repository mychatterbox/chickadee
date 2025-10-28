import { createRoute } from "honox/factory";
import Menu from "../components/menu";
import { zValidator } from "@hono/zod-validator";
import {
  getDefaultGranularityIntervalForTimeframe,
  getDimensions,
  getStats,
  getTimeline,
} from "../lib/db";
import { z } from "zod";
import Dashboard from "../islands/dashboard";
import { getDimensionsMock, getStatsMock, getTimelineMock } from "../lib/mock";
import { getSites } from "../lib/kv";
import { Fragment } from "hono/jsx/jsx-runtime";
import { ZSid, ZTimeframe } from "../lib/models";

export default createRoute(
  zValidator("param", z.object({ sid: ZSid })),
  zValidator("query", z.object({ tf: ZTimeframe })),
  async (c) => {
    // sites
    const sites = await getSites(c);
    const sid = c.req.param("sid");
    if (!sites.includes(sid)) return c.notFound();

    // settings
    const { tf } = c.req.valid("query");
    const granularity = getDefaultGranularityIntervalForTimeframe(tf);

    // get data
    const [stats, timeline, dimensions] = await Promise.all([
      getStats(c, sid, tf),
      getTimeline(c, sid, tf, granularity),
      getDimensions(c, sid, tf),
    ]);
    // DEBUG
    // const stats = getStatsMock();
    // const timeline = getTimelineMock();
    // const dimensions = getDimensionsMock();

    return c.render(
      <Fragment>
        <Menu sites={sites} sid={sid} tf={tf} />
        <Dashboard
          tf={tf}
          granularity={granularity}
          stats={stats}
          timeline={timeline}
          dimensions={dimensions}
        />
      </Fragment>,
    );
  },
);
