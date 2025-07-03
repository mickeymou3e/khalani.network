import { Theme } from "@mui/material";

export const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

export const buttonStyle = {
  mt: 6,
};

export const personStyle = (theme: Theme) => ({
  display: "flex",
  gap: 1.5,

  "& .MuiSvgIcon-root, .MuiTypography-root": {
    color: theme.palette.primary.gray2,
  },
});

export const rowStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};
