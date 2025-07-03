import { alpha, Theme } from "@mui/material";

import { evaluate } from "@/utils/logic";

import { PasswordStrength } from "./helpers";

const calculateIndicatorColor = (passwordStrength: string) =>
  evaluate(
    [passwordStrength === PasswordStrength.None, "primary.gray2"],
    [passwordStrength === PasswordStrength.Weak, "alert.red"],
    [passwordStrength === PasswordStrength.Fair, "alert.orange"],
    [passwordStrength === PasswordStrength.Strong, "alert.green"]
  ) as string;

export const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: 2,
};

export const indicatorContainerStyle = (theme: Theme) => ({
  width: "6rem",
  height: "0.5rem",
  borderRadius: "0.5rem",
  overflow: "hidden",
  backgroundColor: alpha(
    theme.palette.primary.main,
    theme.custom.opacity._10percent
  ),
});

export const indicatorStyle = (passwordStrength: string) => ({
  width: "33%",
  marginLeft: evaluate(
    [passwordStrength === PasswordStrength.None, "-100%"],
    [passwordStrength === PasswordStrength.Weak, 0],
    [passwordStrength === PasswordStrength.Fair, "33%"],
    [passwordStrength === PasswordStrength.Strong, "67%"]
  ),
  height: "100%",
  backgroundColor: calculateIndicatorColor(passwordStrength),
});

export const textStyle = (passwordStrength: string) => ({
  color: calculateIndicatorColor(passwordStrength),
});
