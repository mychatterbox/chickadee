import { z } from "zod";

export const ZDataPoint = z.object({
  sid: z.string(), // blob-1
  evt: z.string(), // blob-2
  ref: z.string().nullable(), // blob-3
  path: z.string(), // blob-4
  hash: z.string().nullable(), // blob-5

  // Location
  country: z.string().nullable(), // blob-6
  region: z.string().nullable(), // blob-7
  city: z.string().nullable(), // blob-8
  timezone: z.string().nullable(), // blob-9

  // Headers
  browser: z.string().nullable(), // blob-10
  browserVersion: z.string().nullable(), // blob-11
  os: z.string().nullable(), // blob-12
  osVersion: z.string().nullable(), // blob-13
  device: z.string().nullable(), // blob-14
  locale: z.string().nullable(), // blob-15

  // UTM
  utmSource: z.string().nullable(), // blob-16
  utmCampaign: z.string().nullable(), // blob-17
  utmMedium: z.string().nullable(), // blob-18

  // User
  dailyVisitorHash: z.string().nullable(), // blob-19
  uid: z.string().nullable(), // blob-20

  // Metrics
  width: z.number().nullable(), // double-1
  loadTime: z.number().nullable(), // double-2

  // Flag
  isBot: z.coerce.boolean().nullable(), // double-3
});
export type IDataPoint = z.infer<typeof ZDataPoint>;

export const Column = {
  // index
  index: "index1",

  // blobs
  sid: "blob1",
  evt: "blob2",
  ref: "blob3",
  path: "blob4",
  hash: "blob5",
  // Location
  country: "blob6",
  region: "blob7",
  city: "blob8",
  timezone: "blob9",
  // Headers
  browser: "blob10",
  browserVersion: "blob11",
  os: "blob12",
  osVersion: "blob13",
  device: "blob14",
  locale: "blob15",
  // UTM
  utmSource: "blob16",
  utmCampaign: "blob17",
  utmMedium: "blob18",
  // User
  dailyVisitorHash: "blob19",
  uid: "blob20",

  // doubles
  // Metrics
  width: "double1",
  loadTime: "double2",
  // Flag
  isBot: "double3",
} as const;

export function toAnalyticsEngineDataPoint(
  data: IDataPoint
): AnalyticsEngineDataPoint {
  // 96 bytes max
  const index = [data.sid.substring(0, 60), data.evt.substring(0, 30)].join(
    ","
  );

  return {
    // max 1 index, 96 bytes
    indexes: [index],
    // max 20 blobs, total 5120 bytes
    blobs: [
      data.sid, // blob-1
      data.evt, // blob-2
      data.ref, // blob-3
      data.path, // blob-4
      data.hash ?? null, // blob-5

      // Location
      data.country ?? null, // blob-6
      data.region ?? null, // blob-7
      data.city ?? null, // blob-8
      data.timezone ?? null, // blob-9

      // Headers
      data.browser ?? null, // blob-10
      data.browserVersion ?? null, // blob-11
      data.os ?? null, // blob-12
      data.osVersion ?? null, // blob-13
      data.device ?? null, // blob-14
      data.locale ?? null, // blob-15

      // UTM
      data.utmSource ?? null, // blob-16
      data.utmCampaign ?? null, // blob-17
      data.utmMedium ?? null, // blob-18

      // User
      data.dailyVisitorHash ?? null, // blob-19
      data.uid ?? null, // blob-20
    ],
    // max 20 doubles
    doubles: [
      // Metrics
      data.width ?? 0, // double-1
      data.loadTime ?? 0, // double-2

      // Flag
      data.isBot ? 1 : 0, // double-3
    ],
  };
}
