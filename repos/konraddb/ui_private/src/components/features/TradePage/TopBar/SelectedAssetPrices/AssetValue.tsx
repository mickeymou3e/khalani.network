import { Box, Typography } from "@mui/material";

import { ExecutionSide, Symbols } from "@/definitions/types";
import { evaluate } from "@/utils/logic";

import { assetlabelStyle, assetValueStyle } from "./SelectedAssetPrices.styles";

export type AssetValueProps = {
  label: string;
  value?: string;
  side?: ExecutionSide;
};

const AssetValue = ({ label, value, side }: AssetValueProps) => {
  const validColor = evaluate(
    [!side, "primary.main"],
    [side === ExecutionSide.SELL, "alert.red"],
    [side === ExecutionSide.BUY, "alert.green"]
  ) as string;
  const color = value ? validColor : "primary.main";

  return (
    <Box sx={assetValueStyle}>
      <Typography sx={assetlabelStyle} variant="body3" color="primary.gray2">
        {label}
      </Typography>
      <Typography variant="subtitle" color={color}>
        {value || Symbols.NoValue}
      </Typography>
    </Box>
  );
};

export default AssetValue;
