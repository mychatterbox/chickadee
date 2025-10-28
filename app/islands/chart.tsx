import { useEffect, useRef, useState, type FC } from "hono/jsx";
import { Chart as ChartJS, type ChartData, type ChartOptions } from "chart.js";
import { twMerge } from "tailwind-merge";

export type Data = ChartData<"line">;
export type Options = ChartOptions<"line">;

const Chart: FC<{
  class?: string;
  data: Data;
  options: Options;
}> = ({ class: cn = "", data, options }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [chart, setChart] = useState<ChartJS<"line">>();

  // init
  useEffect(() => {
    async function init() {
      if (ref.current) {
        const chart = new ChartJS(ref.current, { type: "line", data, options });
        setChart(chart);
      }
    }
    init().catch(console.error);
  }, []);

  // update
  useEffect(() => {
    if (chart) {
      chart.options = options;
      chart.update();
    }
  }, [options]);
  useEffect(() => {
    if (chart) {
      chart.data = data;
      chart.update();
    }
  }, [data]);

  return (
    <div class={twMerge("relative", cn)}>
      <canvas ref={ref} />
    </div>
  );
};

export default Chart;
