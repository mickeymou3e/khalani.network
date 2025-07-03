import { useEffect, useState } from "react";

import PieChartOutlineSharpIcon from "@mui/icons-material/PieChartOutlineSharp";
import { Box, Typography } from "@mui/material";

import { calculateChartColors } from "@/styles/others";
import { iconStyles } from "@/styles/others/muiIconStyles";
import { formatPercentage, hideNumericValues } from "@/utils/formatters";

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
      <Box sx={combinedStyles} data-testid="legend-empty">
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
    <Box sx={combinedStyles} data-testid="legend-filled">
      {dataProvider.map((entry, idx) => {
        const indicatorColor = currentColors[idx % currentColors.length];
        const isSelected = index === idx || index === null;
        const formattedPercentage = formatPercentage(entry?.percentage ?? 0, {
          threshold: 1,
        });
        const completePercentage = hideValues
          ? hideNumericValues(formattedPercentage, 2)
          : formattedPercentage;

        return (
          <Box
            sx={legendEntryStyle}
            key={`legend-${entry.name}`}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
            data-testid={`legend-${entry.name}`}
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
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default Legend;
