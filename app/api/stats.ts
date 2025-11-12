import { type Env, Hono } from "hono";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { z } from "zod";
import { query } from "../lib/db";

const app = new Hono<Env>();

// auth
app.use((c, next) =>
  basicAuth({
    username: c.env.BASIC_USERNAME,
    password: c.env.BASIC_PASSWORD,
  })(c, next)
);

// cors
app.use(
  // TODO allow only from dashboard?
  cors({
    origin: "*", // allow all origins
    allowMethods: ["OPTIONS", "GET", "POST"],
  })
);

// debug
app.get("/debug", async (c) => {
  const res = await query(
    c.env,
    `SELECT * FROM ${c.env.ENGINE_DATASET} ORDER BY timestamp DESC LIMIT 10`,
    z.any()
  );
  return c.json(res);
});

export default app;
