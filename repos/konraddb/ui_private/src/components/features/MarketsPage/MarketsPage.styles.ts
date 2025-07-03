import { Theme } from "@mui/material";

export const containerStyle = (theme: Theme) => ({
  margin: "0 auto",
  width: "74rem",

  ".MuiTable-root": {
    "& .MuiTableRow-root.Mui-selected": {
      backgroundColor: "transparent",
    },
  },

  [theme.breakpoints.down("tabletLandscape")]: {
    width: "100%",
  },
});

export const headingStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1.5rem",
  marginBottom: "1.5rem",
};

export const listLenghtOptionsStyle = {
  width: "8.75rem",
};

export const searchInputStyle = {
  width: "15rem",
};
