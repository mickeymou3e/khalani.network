export const CHART_COLORS = [
  "#008B7A",
  "#00BF91",
  "#00DFAB",
  "#1642FA",
  "#0F8CFF",
  "#61B3FF",
  "#9CD0FF",
  "#BDBBC5",
];

export const EMPTY_CHART_COLOR = "#EBEBEB";

export const calculateChartColors = (highlighted: number | null) =>
  highlighted !== null
    ? CHART_COLORS.map((color, index) =>
        index === highlighted ? color : `${color}40`
      )
    : CHART_COLORS;
