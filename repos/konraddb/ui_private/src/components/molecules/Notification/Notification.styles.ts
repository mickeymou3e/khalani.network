import { alpha, Theme } from "@mui/material";

export const stackStyle =
  (notificationBackground: string) => (theme: Theme) => ({
    borderRadius: "1rem",
    gap: "0.5rem",
    flexDirection: "row",
    alignItems: "center",
    padding: "0.75rem 1rem",
    backgroundColor: alpha(
      notificationBackground,
      theme.custom.opacity._10percent
    ),

    "& > .MuiSvgIcon-root": {
      width: "1.25rem",
      height: "1.25rem",
    },
  });

export const textStyle = {
  display: "inline-block",
};
