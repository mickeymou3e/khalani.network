import { useCallback,useRef } from "react";
import { useTranslation } from "next-i18next";

import { type PopoverActions } from "@mui/material";

import { 
  changeAsset,
  changeRegistry, 
  selectSelectedBridgeOutAssetBalance, 
  selectSelectedBridgeOutAssetDetails
} from "@/features/BridgePage/store";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser } from "@/store/account";
import { selectEnergyAttributeTokens } from "@/store/ancillary";
import { selectIsValidLogin, selectNeutralFeatures } from "@/store/auth";

import { namespace } from "../../config";

export const useAssetSelector = (
  onChange?: (assetKey: string) => void
) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const energyAttributeTokens = useAppSelector(selectEnergyAttributeTokens);
  const selectedAsset = useAppSelector(selectSelectedBridgeOutAssetDetails);
  const selectedAssetBalance = useAppSelector(selectSelectedBridgeOutAssetBalance);
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const isAdmin = useAppSelector(selectIsAdminUser);
  const featureFlags = useAppSelector(selectNeutralFeatures);
  const isBridgeEnabled = featureFlags.bridge && isLoggedIn && isAdmin;
  const popoverActionRef = useRef<PopoverActions>(null);

  const selectLabel = t(`${namespace}:youBridgeOut`);
  const availableText = t(`${namespace}:available`);
  const infoText = t(`${namespace}:info`);
  const selectAssetPlaceholder = t(`${namespace}:selectAsset`);
  const assetInfoText = t(`${namespace}:assetInfo`);

  const handleViewToggle = useCallback(() => {
    popoverActionRef.current?.updatePosition();
  }, []);

  const handleAssetChange =
    (onClose: () => void) =>
    ({ id }: { id: string }) => {
      const newSelectedAsset = energyAttributeTokens.find((item) => item.id === id);

      dispatch(changeAsset(id));
      dispatch(changeRegistry(newSelectedAsset?.registry ?? ""))
      onChange?.(id);
      onClose();
    };

  return {
    energyAttributeTokens,
    selectedAsset,
    selectedAssetBalance,
    isBridgeEnabled,
    popoverActionRef,
    selectLabel,
    availableText,
    infoText,
    selectAssetPlaceholder,
    assetInfoText,
    handleAssetChange,
    handleViewToggle,
  };
};
