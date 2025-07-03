import { AddressState } from "@/types/wallet";
import { BoxProps, TypographyProps } from "@mui/material";

export type StatusAssetProps = {
  label?: string;
  description?: string;
  state?: AddressState | undefined;
  LabelProps?: TypographyProps;
  DescriptionProps?: TypographyProps;
  selected?: boolean;
} & Omit<BoxProps, "sx">;
