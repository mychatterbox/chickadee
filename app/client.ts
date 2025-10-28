import { createClient } from "honox/client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-spacetime";

// * Setup ChartJS

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  TimeScale
);

// Set chart theme based on user's color scheme preference
function updateChartTheme(isDarkMode: boolean) {
  const theme = {
    backgroundColor: isDarkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)",
    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    color: isDarkMode ? "#999" : "#666",
  };

  // Defaults
  ChartJS.defaults.backgroundColor = theme.backgroundColor;
  ChartJS.defaults.borderColor = theme.borderColor;
  ChartJS.defaults.color = theme.color;

  // Update all active charts color options
  for (const chart of Object.values(ChartJS.instances)) {
    if (!chart) continue;

    chart.options.backgroundColor = theme.backgroundColor;
    chart.options.borderColor = theme.borderColor;
    chart.options.color = theme.color;
    if (chart.options.scales?.x?.grid)
      chart.options.scales.x.grid.color = theme.borderColor;
    if (chart.options.scales?.x?.ticks)
      chart.options.scales.x.ticks.color = theme.color;
    if (chart.options.scales?.y?.grid)
      chart.options.scales.y.grid.color = theme.borderColor;
    if (chart.options.scales?.y?.ticks)
      chart.options.scales.y.ticks.color = theme.color;

    chart.update();
  }
}
const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
prefersDarkMode.addEventListener("change", (e) => updateChartTheme(e.matches));
updateChartTheme(prefersDarkMode.matches);

// * Create HonoX client

createClient();
