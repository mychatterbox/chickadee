import type { FC } from "hono/jsx";

export const Header: FC = () => {
  return (
    <div class="navbar shadow-sm bg-base-200">
      <a class="btn btn-ghost text-xl" href="/">
        🐦 Chickadee
      </a>
    </div>
  );
};

export const Footer: FC = () => {
  const url = "https://github.com/abegehr/chickadee";

  return (
    <footer class="footer sm:footer-horizontal footer-center text-base-content p-4 bg-base-200">
      <aside>
        <p>
          🐦 Chickadee -{" "}
          <a href={url} class="link">
            abegehr/chickadee
          </a>
        </p>
      </aside>
    </footer>
  );
};
