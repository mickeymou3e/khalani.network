// usePieChart.tsx
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
  isDataUploaded, // Dodane jako nowe pole do sterowania kolorem
}: PieChartProps & { isDataUploaded: boolean }) => {
  const [index, setIndex] = useState<number | null>(selected);

  const initialColor = "#C0C0C0"; // Początkowy srebrny kolor
  const dynamicColors = calculateChartColors(index); // Dynamiczne kolory po załadowaniu danych

  // Jeśli dane są załadowane, przejdź na dynamiczne kolory, inaczej srebrny
  const currentColors = isDataUploaded ? dynamicColors : Array(1).fill(initialColor);

  const data = isDataUploaded ? dataProvider : [{ name: null, value: 1, percentage: 100 }];

  useEffect(() => {
    setIndex(selected);
  }, [selected]);

  const handleMouseEnter = (_: unknown, index: number) => {
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
    dimensions,
    strokeWidth,
    innerRadius: dimensions / 2 - strokeWidth,
    handleMouseEnter,
    handleMouseLeave,
  };
};
