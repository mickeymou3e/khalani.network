import { alpha, Theme } from "@mui/material";

export const toolbarStyle = (theme: Theme) => ({
  display: "flex",
  justifyContent: "space-between",
  color: theme.palette.primary.main,
});

export const leftPartStyle = (theme: Theme) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(6),
});

export const rightPartStyle = (theme: Theme) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
});

export const buttonGroupStyle = (theme: Theme) => ({
  "&.MuiToggleButtonGroup-root": {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.custom.opacity._3percent
    ),
    borderRadius: "1.5rem",

    "& .MuiButtonBase-root.MuiToggleButton-root": {
      color: theme.palette.primary.main,
      marginRight: 0,

      "&:hover": {
        color: theme.palette.primary.accent,
        backgroundColor: "transparent",
      },

      "&.Mui-selected": {
        color: theme.palette.primary.accent,
        backgroundColor: alpha(
          theme.palette.primary.accent,
          theme.custom.opacity._5percent
        ),
      },
    },
  },
});
