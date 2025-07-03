import { ThemeModes } from "@/types/theme";
import { alpha, SxProps, Theme } from "@mui/material";

export const popperStyle = (maxHeight: string | number) => (theme: Theme) => ({
  "& .MuiPaper-root": {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.primary.gray4,
    maxHeight,
    minWidth: "20rem",
    borderRadius: "1rem",
    overflowY: "hidden",
    boxShadow: `0px 0.25rem 2rem ${theme.palette.custom.shadow}${
      theme.palette.mode === ThemeModes.dark ? "FF" : "2A"
    }`,
  },
});

export const menuStyle = () => ({
  "&.MuiList-root": {
    overflowY: "auto",
    flex: 1,
    "& .MuiMenuItem-root": { paddingLeft: "1.5rem", height: "4rem" },
  },
});

export const backButtonStyle = () => ({
  "&.MuiButtonBase-root": {
    borderRadius: 0,
    alignSelf: "flex-start",
    backgroundColor: "transparent",
    textTransform: "none",
    paddingLeft: "1.5rem",
  },
});

export const listItemStyles = (red: boolean) => (theme: Theme) => ({
  color: red ? theme.palette.alert.red : theme.palette.primary.main,
  span: {
    color: red ? theme.palette.alert.red : theme.palette.primary.main,
  },
});

export const iconButtonStyle =
  (selected: boolean): SxProps<Theme> =>
  (theme: Theme) => ({
    "&, &:hover": {
      backgroundColor: selected
        ? alpha(theme.palette.alert.green, theme.custom.opacity._5percent)
        : undefined,
    },
    "& svg": {
      color: selected ? theme.palette.alert.green : theme.palette.primary.main,
      width: "1.5rem",
      height: "1.5rem",
    },
  });
