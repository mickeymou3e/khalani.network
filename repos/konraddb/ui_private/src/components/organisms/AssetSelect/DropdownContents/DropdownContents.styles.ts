import { Theme } from "@mui/material";

export const containerStyle = (theme: Theme) => ({
  display: "flex",
  flexDirection: "column",
  maxHeight: "440px",
  width: "800px",

  "& .MuiTableContainer-root": {
    borderRadius: 0,
    paddingBottom: 0,
    background: "none",
  },

  "& .MuiTableHead-root .MuiTableCell-root": {
    backgroundColor: theme.palette.primary.gray4,
  },
});

export const headingStyle = (theme: Theme) => ({
  display: "flex",
  gap: theme.spacing(3),
  padding: theme.spacing(3),
});

export const searchInputStyle = {
  flexGrow: 1,
};
