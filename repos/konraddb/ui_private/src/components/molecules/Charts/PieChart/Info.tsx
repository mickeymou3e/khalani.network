import { Box, Typography } from "@mui/material";

import {
  formatEurValue,
  formatPercentage,
  hideNumericValues,
} from "@/utils/formatters";

import { CHART_DIMENSIONS } from "../config";
import { infoStyle } from "./Info.styles";
import { PieChartEntry } from "./PieChart.types";

type InfoProps = {
  chartData: PieChartEntry[];
  selected: number | null;
  hideValues: boolean;
  dimensions?: number;
  formatValue?: (value: number) => string;
};

const Info = ({
  chartData,
  selected,
  hideValues,
  dimensions = CHART_DIMENSIONS,
  formatValue = formatEurValue,
}: InfoProps) => {
  if (selected === null) return null;

  const { name, value, percentage } = chartData[selected];
  const percentageText = formatPercentage(percentage ?? 0);
  const completePercentageText = hideValues
    ? hideNumericValues(percentageText, 2)
    : percentageText;
  const valueText = formatValue(value);
  const completeValueText = hideValues
    ? hideNumericValues(valueText)
    : valueText;

  return (
    <Box sx={infoStyle} width={dimensions} height={dimensions}>
      <Typography variant="body3" color="primary.gray2">
        {name}
      </Typography>
      <Typography variant="h5">{completePercentageText}</Typography>
      <Typography variant="body3">{completeValueText}</Typography>
    </Box>
  );
};

export default Info;
