import { CheckboxProps as MuiCheckboxProps } from "@mui/material";

export enum LabelPlacement {
  end = "end",
  start = "start",
  top = "top",
  bottom = "bottom",
}

export type CheckboxProps = {
  label?: string;
  labelPlacement?: LabelPlacement;
} & MuiCheckboxProps;
