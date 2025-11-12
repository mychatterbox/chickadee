import { z } from "zod";

export enum Metric {
  Visitors = "visitors",
  Pageviews = "pageviews",
}

// site
export const ZSid = z
  .string()
  .toLowerCase()
  .regex(/^[a-z0-9.-]+$/, {
    message: "Only letters, numbers, dots, and hyphens are allowed.",
  });

// settings
export const TIMEFRAMES = ["today", "yesterday", "7d", "30d", "90d"] as const;
export const ZTimeframe = z.enum(TIMEFRAMES).default("7d");
export type ITimeframe = z.infer<typeof ZTimeframe>;
export const ZGranularity = z.enum(["month", "week", "day", "hour"]);
export type IGranularity = z.infer<typeof ZGranularity>;

// stats
export const ZStats = z.object({
  visitors: z.coerce.number(),
  visitorsGrowth: z.coerce.number().optional(),
  views: z.coerce.number(),
  viewsGrowth: z.coerce.number().optional(),
});
export type IStats = z.infer<typeof ZStats>;

// timeline
export const ZTimelineItem = z.object({
  timestamp: z.string().transform((str) => new Date(`${str}Z`)), // Ensure UTC parsing by appending Z
  views: z.coerce.number(),
  visitors: z.coerce.number(),
});
const ZTimeline = ZTimelineItem.array();
export type ITimeline = z.infer<typeof ZTimeline>;

// dimensions
const DIMENSIONS = [
  "ref",
  "path",
  "hash",
  // Location
  "country",
  "region",
  "city",
  "timezone",
  // headers
  "browser",
  "browser_version",
  "os",
  "os_version",
  "device",
  "locale",
  // UTM
  "utm_source",
  "utm_medium",
  "utm_campaign",
] as const;
export type IDimension = (typeof DIMENSIONS)[number];
export const ZBar = z.object({
  value: z.string(),
  count: z.coerce.number(),
});
export type IBar = z.infer<typeof ZBar>;
export const ZDimensionBars = z.object({
  dimension: z.enum(DIMENSIONS),
  bars: ZBar.array(),
});
export type IDimensionBars = z.infer<typeof ZDimensionBars>;
