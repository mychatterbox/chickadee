// app/routes/_middleware.ts
import { createRoute } from "honox/factory";
import { basicAuth } from "hono/basic-auth";

export default createRoute((c, next) => {
  if (c.env.BASIC_USERNAME && c.env.BASIC_PASSWORD)
    return basicAuth({
      username: c.env.BASIC_USERNAME,
      password: c.env.BASIC_PASSWORD,
    })(c, next);
  return next();
});
