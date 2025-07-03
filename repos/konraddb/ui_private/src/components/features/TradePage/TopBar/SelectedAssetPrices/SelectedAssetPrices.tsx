import { useTranslation } from "next-i18next";

import { Box } from "@mui/material";

import { ExecutionSide } from "@/definitions/types";
import { useAppSelector } from "@/store";
import {
  selectSelectedAssetRateDetails,
  selectUnauthenticatedSelectedAssetRateDetails,
} from "@/store/rates/rates.selectors";

import AssetValue from "./AssetValue";
import { containerStyle } from "./SelectedAssetPrices.styles";

const namespace = "trade-page:heading";

const SelectedAssetPrices = () => {
  const { t } = useTranslation();
  const details = useAppSelector(selectSelectedAssetRateDetails);
  const unauthenticatedDetails = useAppSelector(
    selectUnauthenticatedSelectedAssetRateDetails
  );
  const selectedDetails = details ?? unauthenticatedDetails;

  return (
    <Box sx={containerStyle}>
      <AssetValue
        value={selectedDetails?.marketPrice}
        label={t(`${namespace}:marketPrice`)}
      />
      <AssetValue
        value={selectedDetails?.askPrice}
        label={t(`${namespace}:askPrice`)}
        side={ExecutionSide.BUY}
      />
      <AssetValue
        value={selectedDetails?.bidPrice}
        label={t(`${namespace}:bidPrice`)}
        side={ExecutionSide.SELL}
      />
    </Box>
  );
};

export default SelectedAssetPrices;
