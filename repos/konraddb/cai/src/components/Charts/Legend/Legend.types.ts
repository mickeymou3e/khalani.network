import { SxProps, Theme } from "@mui/material";

export type LegendEntry = {
  name: string | null;
  value: number;
  percentage?: number;
};

export type LegendProps = {
  sx?: SxProps<Theme>;
  dataProvider: LegendEntry[];
  selected?: number | null;
  hideValues?: boolean;
  dimensions?: number;
  interactive?: boolean;
  noDataLabel?: string;
  onMouseEnter?: (index: number) => void;
  onMouseLeave?: () => void;
};
