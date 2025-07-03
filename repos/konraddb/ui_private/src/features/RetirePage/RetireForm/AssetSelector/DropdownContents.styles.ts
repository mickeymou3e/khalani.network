import { alpha, SxProps, Theme } from "@mui/material/styles";

export const containerStyle: SxProps<Theme> = (theme: Theme) => ({
  overflowY: "hidden",
  maxWidth: "1200px",
  width: "100%",

  "& .MuiTableContainer-root": {
    borderRadius: 0,
    paddingBottom: 0,
    background: "none",
    overflowY: "hidden",
  },

  "& .MuiTableHead-root .MuiTableCell-root": {
    backgroundColor: theme.palette.primary.gray4,
  },
});

export const gridContainerStyle: SxProps<Theme> = {
  display: "block",
  overflowY: "auto",
  marginRight: "1rem",
};

export const dividerStyle: SxProps<Theme> = (theme: Theme) => ({
  height: "1px",
  marginRight: 1,
  backgroundColor: alpha(
    theme.palette.primary.gray3,
    theme.custom.opacity._10percent
  ),
});

export const sectionTitleStyle: SxProps<Theme> = (theme: Theme) => ({
  color: theme.palette.primary.gray2,
  textTransform: "uppercase",
  padding: "1.5rem 1.5rem 0",
});
