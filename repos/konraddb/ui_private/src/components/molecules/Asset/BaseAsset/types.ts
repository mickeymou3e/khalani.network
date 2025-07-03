import { BoxProps, TypographyProps } from "@mui/material";

import { AddressState } from "@/definitions/types";

export type BaseAssetEntry = {
  icon?: string;
  label?: string;
  name?: string;
  description?: string;
  state?: AddressState | undefined;
};

export type BaseAssetProps = {
  assets: BaseAssetEntry[];
  iconSize?: number;
  label?: string;
  description?: string;
  showDescription?: boolean;
  LabelProps?: TypographyProps;
  DescriptionProps?: TypographyProps;
  showLabel?: boolean;
  small?: boolean;
} & Omit<BoxProps, "sx">;
