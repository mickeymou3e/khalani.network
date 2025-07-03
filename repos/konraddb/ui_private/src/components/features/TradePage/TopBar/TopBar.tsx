import { Box } from "@mui/material";

import { AssetSelect } from "@/components/organisms";

import { SelectedAssetPrices } from "./SelectedAssetPrices";
import { containerStyle, leftPartStyle } from "./TopBar.styles";

const TopBar = () => (
  <Box sx={containerStyle}>
    <Box sx={leftPartStyle}>
      <AssetSelect />
      <SelectedAssetPrices />
    </Box>
  </Box>
);

export default TopBar;
