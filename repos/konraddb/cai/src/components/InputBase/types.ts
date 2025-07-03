import { TextFieldProps } from "@mui/material";

import { InputLabelProps } from "../InputLabel";
import { BaseAssetEntry } from "../Asset";

export type InputBaseProps = {
  TopLabelProps?: InputLabelProps;
  BottomLabelProps?: InputLabelProps;
  assets?: BaseAssetEntry[];
  trailingText?: string;
  alert?: boolean;
  isNumber?: boolean;
  setValue?: (value: string) => void;
  tooltipTitle?: string;
} & TextFieldProps;
