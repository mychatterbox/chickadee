import type { Child, FC } from "hono/jsx";
import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import { Footer, Header } from "../components/common";
import { twMerge } from "tailwind-merge";

const BaseLayout: FC<{ children: Child }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Chickadee Dashboard</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <Link href="/app/style.css" rel="stylesheet" />
        <Script src="/app/client.ts" async />
      </head>
      <body class="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
};

const DashboardLayout: FC<{ children: Child; class?: string }> = ({
  children,
  class: cn = "",
}) => {
  return (
    <BaseLayout>
      <Header />

      <main class={twMerge("flex-grow flex flex-col p-4 lg:p-8 gap-4", cn)}>
        {children}
      </main>

      <Footer />
    </BaseLayout>
  );
};

declare module "hono" {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: <explanation>
    (content: string | Promise<string>, props?: { class?: string }): Response;
  }
}

export default jsxRenderer(({ children, class: cn = "" }) => {
  return <DashboardLayout class={cn}>{children}</DashboardLayout>;
});
