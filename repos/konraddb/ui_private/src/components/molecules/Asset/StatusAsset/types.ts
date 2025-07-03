import { BoxProps, TypographyProps } from "@mui/material";

import { AddressState } from "@/definitions/types";

export type StatusAssetProps = {
  label?: string;
  description?: string;
  state?: AddressState | undefined;
  LabelProps?: TypographyProps;
  DescriptionProps?: TypographyProps;
  selected?: boolean;
} & Omit<BoxProps, "sx">;
