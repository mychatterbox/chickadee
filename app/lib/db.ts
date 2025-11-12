import type { Context, Env } from "hono";
import { z } from "zod";
import { Column } from "../lib/datapoint";
import { escapeSql } from "../lib/sql";
import spacetime, { type Spacetime } from "spacetime";
import {
  type IDimension,
  type IDimensionBars,
  ZBar,
  ZStats,
  ZTimelineItem,
  type IGranularity,
  type ITimeframe,
  type ITimeline,
} from "./models";

// * Query

function createQueryResultSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    meta: z
      .object({
        name: z.string(),
        type: z.string(),
      })
      .array(),
    data: z.array(dataSchema),
    rows: z.number(),
    rows_before_limit_at_least: z.number().optional(),
  });
}

export async function query<T extends z.ZodTypeAny>(
  env: Pick<Env["Bindings"], "ACCOUNT_ID" | "API_TOKEN">,
  query: string,
  dataSchema: T
) {
  console.debug("query()", query);

  const ep = `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/analytics_engine/sql`;
  const res = await fetch(ep, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.API_TOKEN}`,
    },
    body: query,
  });

  // handle error
  if (!res.ok) {
    throw new Error(await res.text());
  }

  // return data
  const result = await res.json();
  console.debug("query ->", result);
  const parsed = createQueryResultSchema(dataSchema).parse(result);
  return parsed;
}

// * Helpers

function getTimeframeDaysBack(tf: ITimeframe): number {
  switch (tf) {
    case "today":
      return 0;
    case "yesterday":
      return 1;
    case "7d":
      return 6;
    case "30d":
      return 29;
    case "90d":
      return 89;
  }
}

function getTimeframeFilter(tf: ITimeframe): string {
  const daysBack = getTimeframeDaysBack(tf);
  return `timestamp >= toStartOfInterval(now(), INTERVAL '1' DAY) - INTERVAL '${daysBack}' DAY`;
}

export function getDefaultGranularityIntervalForTimeframe(
  tf: ITimeframe
): IGranularity {
  switch (tf) {
    case "today":
      return "hour";
    case "yesterday":
      return "hour";
    case "7d":
      return "day";
    case "30d":
      return "day";
    case "90d":
      return "week";
    default:
      throw new Error(`Invalid timeframe: ${tf}`);
  }
}

function getGranularityInterval(g: IGranularity): string {
  switch (g) {
    case "month":
      return "'1' MONTH";
    case "week":
      return "'1' WEEK";
    case "day":
      return "'1' DAY";
    case "hour":
      return "'1' HOUR";
    default:
      throw new Error(`Invalid granularity: ${g}`);
  }
}

// * Stats

export async function getStats(c: Context<Env>, sid: string, tf: ITimeframe) {
  // TODO include percentage growth since last period
  const { data } = await query(
    c.env,
    `
    SELECT
      sum(_sample_interval) as views,
      count(DISTINCT ${Column.dailyVisitorHash}) as visitors
    FROM ${c.env.ENGINE_DATASET}
    WHERE
      ${Column.sid} = ${escapeSql(sid)} AND
      ${Column.evt} = 'view' AND
      ${getTimeframeFilter(tf)}
    `,
    ZStats
  );
  return data.length > 0 ? data[0] : null;
}

// * Timeline

function generateTimeSeriesForInterval(
  start: Spacetime,
  end: Spacetime,
  granularity: IGranularity
): Spacetime[] {
  const dates: Spacetime[] = [];
  let current = start.clone();

  while (current.isBefore(end) || current.isSame(end, "minute")) {
    dates.push(current);
    current = current.add(1, granularity);
  }

  return dates;
}

export async function getTimeline(
  c: Context<Env>,
  sid: string,
  tf: ITimeframe,
  g: IGranularity
): Promise<ITimeline> {
  const daysBack = getTimeframeDaysBack(tf);
  const group = getGranularityInterval(g);

  const { data } = await query(
    c.env,
    `
    SELECT
      toStartOfInterval(timestamp, INTERVAL ${group}) as timestamp,
      sum(_sample_interval) as views,
      count(DISTINCT ${Column.dailyVisitorHash}) as visitors
    FROM ${c.env.ENGINE_DATASET}
    WHERE
      ${Column.sid} = ${escapeSql(sid)} AND
      ${Column.evt} = 'view' AND
      ${getTimeframeFilter(tf)}
    GROUP BY timestamp
    ORDER BY timestamp ASC
    `,
    ZTimelineItem
  );

  // Fill in missing timestamps
  const start = spacetime.now("utc").startOf("day").subtract(daysBack, "day");
  const end = spacetime.now("utc");
  const series = generateTimeSeriesForInterval(start, end, g);
  console.debug("series", series);
  const dataMap = new Map(data.map((item) => [item.timestamp.getTime(), item]));
  console.debug("data", data);
  const filled = series.map((ts) => {
    const existing = dataMap.get(ts.epoch);
    return (
      existing ?? {
        timestamp: ts.toNativeDate(),
        views: 0,
        visitors: 0,
      }
    );
  });
  console.debug("filled", filled);

  return filled;
}

// * Dimensions

export async function getDimensions(
  c: Context<Env>,
  sid: string,
  tf: ITimeframe
): Promise<IDimensionBars[]> {
  // Since we can't use UNION, we'll need to make separate queries for each dimension
  const dimensions: { name: IDimension; column: string }[] = [
    { name: "ref", column: Column.ref },
    { name: "path", column: Column.path },
    { name: "hash", column: Column.hash },
    // Location
    { name: "country", column: Column.country },
    { name: "region", column: Column.region },
    { name: "city", column: Column.city },
    { name: "timezone", column: Column.timezone },
    // headers
    { name: "browser", column: Column.browser },
    { name: "browser_version", column: Column.browserVersion },
    { name: "os", column: Column.os },
    { name: "os_version", column: Column.osVersion },
    { name: "device", column: Column.device },
    { name: "locale", column: Column.locale },
    // UTM
    { name: "utm_source", column: Column.utmSource },
    { name: "utm_medium", column: Column.utmMedium },
    { name: "utm_campaign", column: Column.utmCampaign },
  ];

  // Execute queries for each dimension
  const results = await Promise.all(
    dimensions.map((dim) =>
      query(
        c.env,
        `SELECT
          ${dim.column} as value,
          count(DISTINCT ${Column.dailyVisitorHash}) as count
        FROM ${c.env.ENGINE_DATASET}
        WHERE
          ${Column.sid} = ${escapeSql(sid)} AND
          ${Column.evt} = 'view' AND
          ${getTimeframeFilter(tf)}
        GROUP BY value
        ORDER BY count DESC`,
        ZBar
      )
    )
  );

  // Combine all results
  return results.map((result, i) => ({
    dimension: dimensions[i].name,
    bars: result.data,
  })) satisfies IDimensionBars[];
}
