import { createRoute } from "honox/factory";
import { getSites } from "../lib/kv";

export default createRoute(async (c) => {
  const sites = await getSites(c);

  // redirect to setup if no sites
  if (sites.length === 0) return c.redirect("/setup");

  // redirect to last site by default
  const sid = Array.from(sites)[0];
  return c.redirect(`/${sid}`);
});
