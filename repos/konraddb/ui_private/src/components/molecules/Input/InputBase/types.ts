import { TextFieldProps } from "@mui/material";

import { BaseAssetEntry } from "@/components/molecules/Asset";

import { InputLabelProps } from "../InputLabel";

export type InputBaseProps = {
  TopLabelProps?: InputLabelProps;
  BottomLabelProps?: InputLabelProps;
  assets?: BaseAssetEntry[];
  trailingText?: string;
  alert?: boolean;
  setValue?: (value: string) => void;
  tooltipTitle?: string;
} & TextFieldProps;
