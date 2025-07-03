import { SxProps, Theme } from "@mui/material/styles";

export const containerStyle: SxProps<Theme> = (theme: Theme) => ({
  overflowY: "hidden",
  maxWidth: "1200px",
  width: "100%",

  "& .MuiTableContainer-root": {
    borderRadius: 0,
    paddingBottom: 0,
    background: "none",
    overflowY: "auto",
  },

  "& .MuiTableHead-root .MuiTableCell-root": {
    backgroundColor: theme.palette.primary.gray4,
  },
});
