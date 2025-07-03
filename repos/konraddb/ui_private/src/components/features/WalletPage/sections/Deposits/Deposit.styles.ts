import { Theme } from "@mui/material/styles";

import { subpageContainerStyles } from "../../WalletPage.styles";

export const containerStyle = (theme: Theme) => ({
  ...subpageContainerStyles(theme),
});

export const contentWrapperGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "3rem",
  width: "100%",
};
