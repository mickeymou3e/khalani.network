import { useCallback,useRef } from "react";
import { useTranslation } from "next-i18next";

import { type PopoverActions } from "@mui/material";

import { selectedAssetChanged , selectSelectedAsset } from "@/features/RetirePage/store";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectEnergyAttributeTokens } from "@/store/ancillary";
import { selectIsValidLogin, selectNeutralFeatures } from "@/store/auth";

import { selectPoolTokens, selectSelectedAssetBalance } from "../../store/retire.selectors";
import { namespace } from "../config";

export const useAssetSelector = (
  onChange?: (assetKey: string) => void
) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const featureFlags = useAppSelector(selectNeutralFeatures);
  const selectedAssetBalance = useAppSelector(selectSelectedAssetBalance);
  const energyAttributeTokens = useAppSelector(selectEnergyAttributeTokens);
  const poolTokens = useAppSelector(selectPoolTokens);
  const selectedAsset = useAppSelector(selectSelectedAsset);
  const popoverActionRef = useRef<PopoverActions>(null);
  const isPoolTokenBalanceZero = Boolean(poolTokens.length) && poolTokens[0].balanceValue === 0;
  const disabled = !isLoggedIn || !featureFlags.retire || (isPoolTokenBalanceZero && !energyAttributeTokens.length);

  const selectLabel = t(`${namespace}:youRetire`);
  const balanceText = t(`${namespace}:available`);
  const infoTexts = t(`${namespace}:info`, {
    returnObjects: true,
  }) as string[];
  const placeholderText = t(`${namespace}:placeholder`);
  const assetInfoText = t(`${namespace}:assetInfo`);

  const handleViewToggle = useCallback(() => {
    popoverActionRef.current?.updatePosition();
  }, []);

  const handleAssetChange =
    (onClose: () => void) =>
    ({ id }: { id: string }) => {
      dispatch(selectedAssetChanged(id));
      onChange?.(id);
      onClose();
    };

  return {
    poolTokens,
    energyAttributeTokens,
    selectedAsset,
    selectedAssetBalance,
    popoverActionRef,
    disabled,
    selectLabel,
    balanceText,
    infoTexts,
    placeholderText,
    assetInfoText,
    handleAssetChange,
    handleViewToggle,
  };
};
