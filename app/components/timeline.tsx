import { useMemo, type FC } from "hono/jsx";
import Chart, { type Data, type Options } from "../islands/chart";
import { type IGranularity, type ITimeline, Metric } from "../lib/models";
import type { ChartDataset } from "chart.js";

const Timeline: FC<{
  timeline: ITimeline;
  granularity: IGranularity;
  metric: Metric;
}> = ({ timeline, granularity, metric }) => {
  const options: Options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {},
      scales: {
        x: {
          type: "time",
          time: {
            minUnit: granularity,
          },
          ticks: {
            source: "data",
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    }),
    [granularity],
  );

  const data: Data = useMemo(() => {
    let dataset: ChartDataset<"line">;
    switch (metric) {
      case Metric.Visitors:
        dataset = {
          label: "Visitors",
          data: timeline.map((item) => item.visitors),
          borderColor: "#10B981",
          backgroundColor: "#10B98180",
        };
        break;
      case Metric.Pageviews:
        dataset = {
          label: "Pageviews",
          data: timeline.map((item) => item.views),
          borderColor: "#1A56DB",
          backgroundColor: "#1A56DB80",
        };
        break;
    }

    return {
      labels: timeline.map((item) => item.timestamp),
      datasets: [dataset],
    };
  }, [timeline, metric]);

  return (
    <div class="space-y-1">
      <Chart class="h-96 w-full" options={options} data={data} />
      <p class="text-xs text-gray-500 text-end">(time in UTC)</p>
    </div>
  );
};

export default Timeline;
