import { Theme } from "@mui/material/styles";

import { subpageContainerStyles } from "../../WalletPage.styles";

export const containerStyle = (theme: Theme) => ({
  ...subpageContainerStyles(theme),
});
