import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { createApp } from "honox/server";
import api from "./api";
import { Hono } from "hono";

const app = new Hono();

// logger
app.use(logger());

// serve the api
app.route("/api", api);

// serve the dashboard - should be last
app.route("/", createApp());

showRoutes(app);

export default app;
