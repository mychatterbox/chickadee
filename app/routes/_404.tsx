import type { NotFoundHandler } from "hono";

const handler: NotFoundHandler = (c) => {
  c.status(404);
  return c.render(
    <article class="prose prose-lg text-center">
      <h1>404 Site Not Found</h1>
      <p>Do you want to setup this site?</p>
      <a href="/setup" class="btn btn-primary btn-xl btn-wide">
        Setup
      </a>
    </article>,
    { class: "justify-center items-center" },
  );
};

export default handler;
