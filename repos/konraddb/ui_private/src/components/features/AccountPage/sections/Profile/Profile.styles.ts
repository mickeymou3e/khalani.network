import { Theme } from "@mui/material/styles";

import { subpageContainerStyles } from "../../AccountPage.styles";

export const containerStyle = (theme: Theme) => ({
  ...subpageContainerStyles(theme),
});

export const contentWrapper = (theme: Theme) => ({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 6,

  [theme.breakpoints.down("tabletLandscape")]: {
    gridTemplateColumns: "1fr",
  },
});
