import { SxProps, Theme } from "@mui/material";

export const paginationContainerStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};

export const paginationStyle = (theme: Theme) => ({
  margin: theme.spacing(2, 0),
});

export const pageSizeContainer: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 2,

  "& .MuiTextField-root": {
    width: "7rem",
  },
};
