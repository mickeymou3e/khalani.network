import { useCallback, useRef } from "react";
import { useTranslation } from "next-i18next";

import { PopoverActions } from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectPoolDeposits } from "@/store/ancillary";
import { PoolMode, PoolModes, selectedAssetKeyChanged } from "@/store/pool";

import {
  selectEligibleEnergyAttributeTokens,
  selectSelectedAsset,
  selectSelectedPoolDepositBalance,
} from "../store/pool.selectors";
import { namespace } from "./config";

export const useAssetSelector = (
  action: PoolMode,
  onChange?: (assetKey: string) => void
) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const strategyAssets = useAppSelector(selectEligibleEnergyAttributeTokens);
  const poolAssets = useAppSelector(selectPoolDeposits);
  const selectedAsset = useAppSelector(selectSelectedAsset);
  const selectedPoolDepositAssetBalances = useAppSelector(
    selectSelectedPoolDepositBalance
  );
  const popoverActionRef = useRef<PopoverActions>(null);
  const isRedeem = action === PoolModes.Redeem;
  const assets = isRedeem ? poolAssets : strategyAssets;

  const balanceText = t(`${namespace}:available`);
  const infoText = t(`${namespace}:info`);
  const maxAmountText = t(`${namespace}:maxAmount`);
  const placeholderText = t(`${namespace}:placeholder`);
  const assetInfoText = t(`${namespace}:assetInfo`);

  const handleViewToggle = useCallback(() => {
    popoverActionRef.current?.updatePosition();
  }, []);

  const handleAssetChange =
    (onClose: () => void) =>
    ({ id }: { id: string }) => {
      dispatch(selectedAssetKeyChanged(id));
      onChange?.(id);
      onClose();
    };

  return {
    assets,
    selectedAsset,
    selectedPoolDepositAssetBalances,
    popoverActionRef,
    isRedeem,
    balanceText,
    infoText,
    maxAmountText,
    placeholderText,
    assetInfoText,
    handleAssetChange,
    handleViewToggle,
  };
};
