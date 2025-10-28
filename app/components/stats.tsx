import type { FC } from "hono/jsx";
import { type IStats, Metric } from "../lib/models";
import { twMerge } from "tailwind-merge";

const Stats: FC<{
  stats: IStats | null;
  metric: Metric;
  setMetric: (metric: Metric) => void;
}> = ({ stats, metric, setMetric }) => {
  return (
    <div class="stats shadow stats-horizontal w-fit">
      {/* Visitors */}
      <button
        type="button"
        class="stat text-start min-w-32"
        onClick={() => setMetric(Metric.Visitors)}
      >
        <div class="stat-figure">
          <span class="icon-[carbon--user] scale-150" />
        </div>
        <div class="stat-title">Visitors</div>
        <div class="stat-value">{stats?.visitors}</div>
        <div class="stat-desc">
          {stats?.visitorsGrowth ? `${stats.visitorsGrowth}%` : ""}
        </div>
        <div
          class={twMerge(
            "w-full h-1 bg-accent mt-1 col-span-2",
            metric === Metric.Visitors ? "visible" : "invisible",
          )}
        />
      </button>

      {/* Page Views */}
      <button
        type="button"
        class="stat text-start min-w-32"
        onClick={() => setMetric(Metric.Pageviews)}
      >
        <div class="stat-figure">
          <span class="icon-[carbon--view] scale-150" />
        </div>
        <div class="stat-title">Page Views</div>
        <div class="stat-value">{stats?.views}</div>
        <div class="stat-desc">
          {stats?.viewsGrowth ? `${stats.viewsGrowth}%` : ""}
        </div>
        <div
          class={twMerge(
            "w-full h-1 bg-accent mt-1 col-span-2",
            metric === Metric.Pageviews ? "visible" : "invisible",
          )}
        />
      </button>

      {/* TODO bounce rate? */}
      {/* <div class="stat">
        <div class="stat-figure text-secondary">
          <div class="avatar online">
            <div class="w-16 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
        </div>
        <div class="stat-value">86%</div>
        <div class="stat-title">Tasks done</div>
        <div class="stat-desc text-secondary">31 tasks remaining</div>
      </div> */}
    </div>
  );
};
export default Stats;
