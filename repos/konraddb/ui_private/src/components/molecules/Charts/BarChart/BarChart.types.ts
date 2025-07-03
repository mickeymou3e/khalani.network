export type BarChartEntry = {
  name: string;
  [key: string]: string | number;
};

export type BarChartProps = {
  dataProvider: BarChartEntry[];
  columnOrder?: string[];
  width?: number;
  height?: number;
};
