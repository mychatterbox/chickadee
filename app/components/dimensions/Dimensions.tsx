import type { FC } from "hono/jsx";
import type { IDimensionBars } from "../../lib/models";
import {
  DimensionsCardDevice,
  DimensionsCardLocation,
  DimensionsCardPage,
  DimensionsCardSource,
} from "./DimensionsCards";

const Dimensions: FC<{
  dimensions: IDimensionBars[];
}> = ({ dimensions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DimensionsCardSource dimensions={dimensions} />
      <DimensionsCardPage dimensions={dimensions} />
      <DimensionsCardLocation dimensions={dimensions} />
      <DimensionsCardDevice dimensions={dimensions} />
    </div>
  );
};

export default Dimensions;
