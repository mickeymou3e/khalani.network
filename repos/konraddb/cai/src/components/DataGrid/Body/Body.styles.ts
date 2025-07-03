import { alpha, Theme } from "@mui/material";

export const tableBodyStyle = {
  height: "max-content",
};

export const rowStyle =
  (noExtraPadding: boolean, inline = false, noContentPadding = false) =>
  (theme: Theme) => ({
    "&.MuiTableRow-hover:hover": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.custom.opacity._5percent
      ),
    },

    "&.MuiTableRow-root.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.custom.opacity._5percent
      ),
    },

    "& td.MuiTableCell-root.MuiTableCell-body": {
      padding: noContentPadding && !inline ? 0 : theme.spacing(1.5),
      border: "none",

      "&:first-of-type": {
        paddingLeft:
          noContentPadding || inline
            ? 0
            : theme.spacing(noExtraPadding ? 1 : 3),
      },
      "&:last-of-type": {
        paddingRight:
          noContentPadding || inline
            ? 0
            : theme.spacing(noExtraPadding ? 1 : 3),
      },

      "& *": {
        whiteSpace: "nowrap",
      },
    },
  });
