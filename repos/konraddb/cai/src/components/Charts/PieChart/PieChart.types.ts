export type PieChartEntry = {
  name: string | null;
  value: number;
  percentage?: number;
};

export type PieChartProps = {
  dataProvider: PieChartEntry[];
  selected?: number | null;
  hideValues?: boolean;
  interactive?: boolean;
  dimensions?: number;
  strokeWidth?: number;
  formatValue?: (value: number) => string;
  onMouseEnter?: (index: number) => void;
  onMouseLeave?: () => void;
};
