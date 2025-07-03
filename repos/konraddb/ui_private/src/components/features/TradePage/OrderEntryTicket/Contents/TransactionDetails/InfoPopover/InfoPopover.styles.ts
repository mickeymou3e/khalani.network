import { Theme } from "@mui/material";

export const iconStyle = (theme: Theme) => ({
  fontSize: "1.25rem",
  color: theme.palette.primary.main,
});

export const popoverStyles = (theme: Theme) => ({
  "& .MuiPaper-root": {
    display: "flex",
    flexDirection: "column",
    gap: 1,
    width: "400px",
    padding: theme.spacing(3, 4),
    backgroundColor: theme.palette.primary.gray4,
    backgroundImage: "none",
    boxShadow: "0px 0px 24px 0px #16131C",
    borderRadius: "0.5rem",
  },
});
