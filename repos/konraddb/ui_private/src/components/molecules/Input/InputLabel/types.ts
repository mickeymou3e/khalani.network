import { BoxProps, TypographyProps } from "@mui/material";

type LabelProps = {
  value: string | React.ReactNode;
  TypographyProps?: TypographyProps;
};

export type InputLabelProps = {
  LabelProps?: LabelProps;
  SecondaryLabelProps?: LabelProps;
  TertiaryLabelProps?: LabelProps;
  QuaternaryLabelProps?: LabelProps;
  error?: boolean;
  tooltipTitle?: string;
} & BoxProps;
