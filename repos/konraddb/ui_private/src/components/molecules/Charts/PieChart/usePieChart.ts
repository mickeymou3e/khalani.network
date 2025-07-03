import { useEffect, useState } from "react";

import { calculateChartColors } from "@/styles/others";

import { CHART_DIMENSIONS } from "../config";
import { PieChartProps } from "./PieChart.types";

export const usePieChart = ({
  dataProvider,
  selected = null,
  interactive = false,
  dimensions = CHART_DIMENSIONS,
  strokeWidth = 16,
  onMouseEnter,
  onMouseLeave,
}: PieChartProps) => {
  const [index, setIndex] = useState<number | null>(selected);
  const currentColors = calculateChartColors(index);
  const isEmpty = !dataProvider.length;
  const data = isEmpty
    ? [{ name: null, value: 1, percentage: 100 }]
    : dataProvider;

  useEffect(() => {
    setIndex(selected);
  }, [selected]);

  const handleMouseEnter = (_: any, index: number) => {
    if (!dataProvider.length || !interactive) return;

    setIndex(index);
    onMouseEnter?.(index);
  };

  const handleMouseLeave = () => {
    setIndex(null);
    onMouseLeave?.();
  };

  return {
    data,
    index,
    currentColors,
    isEmpty,
    dimensions,
    strokeWidth,
    innerRadius: dimensions / 2 - strokeWidth,
    handleMouseEnter,
    handleMouseLeave,
  };
};
