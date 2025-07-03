import { alpha, Theme } from "@mui/material";

export const buttonStyle = (theme: Theme) => ({
  "&.MuiButtonBase-root.MuiToggleButton-root": {
    minWidth: "2rem",
    minHeight: "2rem",
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    border: "none",
    padding: "1rem",
    margin: 0,

    "&.Mui-selected": {
      backgroundColor: "transparent",

      "&:hover": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.custom.opacity._10percent
        ),
      },
    },

    "&.Mui-disabled": {
      color: theme.palette.primary.gray2,
    },

    "& .MuiSvgIcon-root": {
      width: "1.5rem",
      height: "1.5rem",
    },
  },
});
