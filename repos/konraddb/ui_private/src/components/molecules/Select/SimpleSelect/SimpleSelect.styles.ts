import { Theme } from "@mui/material";

export const searchInputStyle = (theme: Theme) => ({
  padding: theme.spacing(3),
});

export const menuStyle = (hasScrollbar: boolean) => ({
  margin: `0 ${hasScrollbar ? "1rem" : "0"} 0 0`,
  padding: 0,
  overflowY: "auto",
  flex: 1,
});

export const simpleMenuItemsStyle = (noMargin: boolean) => () => ({
  whiteSpace: "nowrap",
  marginLeft: noMargin ? "undefined" : "1.5rem",
});

export const emptyBodyStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  height: "16rem",
};
