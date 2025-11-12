import type { FC } from "hono/jsx";
import { TIMEFRAMES, type ITimeframe } from "../lib/models";

const Menu: FC<{ sites: string[]; sid: string; tf: ITimeframe }> = ({
  sites,
  sid,
  tf,
}) => {
  return (
    <div class="flex flex-row gap-4 justify-between items-center">
      <SelectSite sites={sites} sid={sid} />
      <SelectTimeframe tf={tf} />
    </div>
  );
};
export default Menu;

const SelectSite: FC<{ sites: string[]; sid: string }> = ({ sites, sid }) => {
  return (
    <details class="dropdown">
      <summary class="btn m-1 space-x-1">
        <span class="icon-[carbon--link] scale-150" />
        <span>{sid}</span>
        <span class="icon-[carbon--caret-down]" />
      </summary>
      <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        {sites.toSorted().map((site) => (
          <li key={site}>
            <a href={`/${site}`}>{site}</a>
          </li>
        ))}
        <li>
          <a href="/setup">
            <span class="icon-[carbon--add] scale-150" />
            Add Site
          </a>
        </li>
      </ul>
    </details>
  );
};

const SelectTimeframe: FC<{ tf: ITimeframe }> = ({ tf }) => {
  const labels: Record<ITimeframe, string> = {
    today: "Today",
    yesterday: "Yesterday",
    "7d": "7 Days",
    "30d": "30 Days",
    "90d": "90 Days",
  };

  return (
    <details class="dropdown dropdown-end">
      <summary class="btn m-1 space-x-1">
        <span class="icon-[carbon--time] scale-150" />
        <span>{labels[tf]}</span>
        <span class="icon-[carbon--caret-down]" />
      </summary>
      <ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        {TIMEFRAMES.map((value) => (
          <li key={value}>
            <a href={`?tf=${value}`} class={tf === value ? "active" : ""}>
              {labels[value]}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
};
