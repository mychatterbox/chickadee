import type { Context, Env } from "hono";

// * Sites

export async function getSites(c: Context<Env>): Promise<string[]> {
  const value = await c.env.KV.get("sites");
  if (!value) return [];
  return value.split(",");
}

export async function addSite(c: Context<Env>, sid: string) {
  const sites = await getSites(c);
  if (sites.includes(sid)) return;
  await c.env.KV.put("sites", [...sites, sid].join(","));
}
