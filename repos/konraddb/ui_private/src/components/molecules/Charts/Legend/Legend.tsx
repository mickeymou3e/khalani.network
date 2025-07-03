import { useEffect, useState } from "react";

import PieChartOutlineSharpIcon from "@mui/icons-material/PieChartOutlineSharp";
import { Box, Typography } from "@mui/material";

import { calculateChartColors } from "@/styles/others";
import { iconStyles } from "@/styles/others/muiIconStyles";
import {
  formatEurValue,
  formatPercentage,
  hideNumericValues,
} from "@/utils/formatters";

import { CHART_DIMENSIONS } from "../config";
import {
  emptyLegendContainerStyle,
  indicatorStyle,
  leftContentStyle,
  legendContainerStyle,
  legendEntryStyle,
  rightContentStyle,
  textStyle,
} from "./Legend.styles";
import { LegendProps } from "./Legend.types";

const Legend = ({
  sx,
  dataProvider,
  selected = null,
  dimensions = CHART_DIMENSIONS,
  hideValues = false,
  interactive = false,
  noDataLabel = "",
  formatValue = formatEurValue,
  onMouseEnter,
  onMouseLeave,
}: LegendProps) => {
  const [index, setIndex] = useState<number | null>(selected);
  const isEmpty = !dataProvider.length || !dataProvider[0].name;
  const currentColors = calculateChartColors(selected);

  useEffect(() => {
    setIndex(selected);
  }, [selected]);

  const handleMouseEnter = (index: number) => {
    if (!dataProvider.length || !interactive) return;

    setIndex(index);
    onMouseEnter?.(index);
  };

  const handleMouseLeave = () => {
    setIndex(null);
    onMouseLeave?.();
  };

  if (isEmpty) {
    const combinedStyles = [
      ...(Array.isArray(sx) ? sx : [sx]),
      emptyLegendContainerStyle(dimensions),
    ];

    return (
      <Box sx={combinedStyles}>
        <PieChartOutlineSharpIcon sx={iconStyles("4rem")} />
        <Typography variant="body2" color="primary.gray2">
          {noDataLabel}
        </Typography>
      </Box>
    );
  }

  const combinedStyles = [
    ...(Array.isArray(sx) ? sx : [sx]),
    legendContainerStyle(dimensions),
  ];

  return (
    <Box sx={combinedStyles}>
      {dataProvider.map((entry, idx) => {
        const indicatorColor = currentColors[idx % currentColors.length];
        const isSelected = index === idx || index === null;
        const formattedPercentage = formatPercentage(entry?.percentage ?? 0);
        const completePercentage = hideValues
          ? hideNumericValues(formattedPercentage, 2)
          : formattedPercentage;
        const formattedEurValue = formatValue(entry.value);
        const completeEurValue = hideValues
          ? hideNumericValues(formattedEurValue)
          : formattedEurValue;

        return (
          <Box
            sx={legendEntryStyle}
            key={`legend-${entry.name}`}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
          >
            <Box sx={leftContentStyle}>
              <Box sx={indicatorStyle(indicatorColor)} />
              <Typography sx={textStyle(isSelected)} variant="body3">
                {entry.name}
              </Typography>
            </Box>
            <Box sx={rightContentStyle}>
              <Typography
                sx={textStyle(isSelected)}
                variant="body3"
                fontWeight="bold"
              >
                {completePercentage}
              </Typography>
              <Typography
                sx={textStyle(isSelected)}
                variant="body3"
                fontWeight="bold"
              >
                {completeEurValue}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default Legend;
