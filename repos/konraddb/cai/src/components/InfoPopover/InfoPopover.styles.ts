import { Theme } from "@mui/material";

export const iconStyle = (theme: Theme) => ({
  fontSize: "1.25rem",
  color: theme.palette.primary.main,
});

export const popoverStyles = (width: string) => (theme: Theme) => ({
  "& .MuiPaper-root": {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    width,
    padding: theme.spacing(3, 4),
    backgroundColor: theme.palette.primary.gray4,
    backgroundImage: "none",
    boxShadow: `0px 0px 24px 0px ${theme.palette.custom.shadow}`,
    borderRadius: "0.5rem",
  },
});

export const buttonCustomStyles = (iconSize: string) => ({
  "& > svg": {
    width: iconSize,
    height: iconSize,
  },
});
