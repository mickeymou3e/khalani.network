import { useMemo } from "react";
import {
  Bar,
  BarChart as VendorBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { calculateChartColors } from "@/styles/others";
import { formatShortValue } from "@/utils/formatters";

import { CHART_DIMENSIONS, VINTAGE_CHART_DIMENSIONS } from "../config";
import { BarChartProps } from "./BarChart.types";

const BarChart = ({
  dataProvider,
  columnOrder,
  width = VINTAGE_CHART_DIMENSIONS,
  height = CHART_DIMENSIONS,
}: BarChartProps) => {
  const colors = calculateChartColors(null);
  const order =
    columnOrder ||
    dataProvider.reduce(
      (acc, item) => [
        ...acc,
        ...Object.keys(item).filter(
          (key) => key !== "name" && !acc.includes(key)
        ),
      ],
      [] as string[]
    );

  //TODO: apply sortDateKeys fn
  const sortedDataProvider = useMemo(() => dataProvider, [dataProvider]);

  return (
    <VendorBarChart width={width} height={height} data={sortedDataProvider}>
      <CartesianGrid strokeDasharray="1 4" vertical={false} />
      <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11.5} />
      <YAxis
        axisLine={false}
        tickLine={false}
        fontSize={12}
        width={32}
        tickFormatter={(value: number) => formatShortValue(value, 0)}
      />
      {order.map((valueKey, idx) => (
        <Bar
          key={valueKey}
          dataKey={valueKey}
          stackId="stack"
          fill={colors[idx]}
          barSize={12}
        />
      ))}
    </VendorBarChart>
  );
};

export default BarChart;
