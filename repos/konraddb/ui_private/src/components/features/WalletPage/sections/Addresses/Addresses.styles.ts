import { Theme } from "@mui/material";

import { subpageContainerStyles } from "../../WalletPage.styles";

export const containerStyle = (theme: Theme) => ({
  ...subpageContainerStyles(theme),
});

export const placeholderStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 3,
  minHeight: "15rem",
};
