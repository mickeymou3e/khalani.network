import { Cell, Pie, PieChart as VendorPieChart } from "recharts";

import { Box } from "@mui/material";

import { EMPTY_CHART_COLOR } from "@/styles/others";
import { formatEurValue } from "@/utils/formatters";

import Info from "./Info";
import { PieChartProps } from "./PieChart.types";
import { usePieChart } from "./usePieChart";

const PieChart = ({
  hideValues = false,
  formatValue = formatEurValue,
  ...rest
}: PieChartProps) => {
  const {
    data,
    index,
    currentColors,
    isEmpty,
    dimensions,
    strokeWidth,
    innerRadius,
    handleMouseEnter,
    handleMouseLeave,
  } = usePieChart(rest);

  return (
    <Box position="relative">
      <VendorPieChart width={dimensions} height={dimensions}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={innerRadius + strokeWidth}
          startAngle={90}
          endAngle={-270}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {data.map((entry, index) => {
            const fillColor = isEmpty
              ? EMPTY_CHART_COLOR
              : currentColors[index % currentColors.length];

            return (
              <Cell
                key={`cell-${entry.name}`}
                fill={fillColor}
                strokeWidth={0}
              />
            );
          })}
        </Pie>
      </VendorPieChart>
      <Info
        chartData={data}
        selected={index}
        hideValues={hideValues}
        formatValue={formatValue}
      />
    </Box>
  );
};

export default PieChart;
