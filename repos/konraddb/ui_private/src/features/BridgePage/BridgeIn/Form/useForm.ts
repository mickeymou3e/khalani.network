import { useTranslation } from "next-i18next";

import {
  changeAsset,
  changeRegistry,
  selectSelectedBridgeInAsset,
  selectSelectedRegistry,
} from "@/features/BridgePage/store";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser } from "@/store/account";
import { selectIsValidLogin, selectNeutralFeatures } from "@/store/auth";
import { evaluate } from "@/utils/logic";

import { namespace } from "../config";
import { createAssetTypes, createRegistryAssets } from "./Form.helpers";

export const useForm = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const selectedAsset = useAppSelector(selectSelectedBridgeInAsset);
  const selectedRegistry = useAppSelector(selectSelectedRegistry);
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const featureFlags = useAppSelector(selectNeutralFeatures);
  const isAdmin = useAppSelector(selectIsAdminUser);
  const isBridgeEnabled = featureFlags.bridge && isLoggedIn && isAdmin;
  const bridgeInLabel = t(`${namespace}:bridgeIn`);
  const bridgeInPlaceholder = t(`${namespace}:bridgeInPlaceholder`);
  const registryLabel = t(`${namespace}:registry`);
  const registryPlaceholder = t(`${namespace}:registryPlaceholder`);
  const selectAssetText = t(`${namespace}:selectAsset`);
  const transferInstructionsLabel = t(`${namespace}:transferInstructions`);
  const narTransferInstructions = t(`${namespace}:narTransferInstructions`, {
    registry: selectedRegistry?.name,
    accountId: selectedRegistry?.transferAccountId,
  });
  const isSelectedRegistry = selectedRegistry && isLoggedIn && isAdmin;
  const registryInstructions = evaluate(
    [true, ""],
    [isLoggedIn && !selectedRegistry, t(`${namespace}:selectRegistry`)],
    [isLoggedIn && !isAdmin, t(`${namespace}:notEnoughPermission`)],
    [!isLoggedIn, t(`${namespace}:login`)]
  ) as string;
  const assets = createAssetTypes();
  const registries = createRegistryAssets();

  const handleChangeAsset = (value: unknown) => {
    dispatch(changeAsset(value as string));
  };

  const handleChangeRegistry = (value: unknown) => {
    dispatch(changeRegistry(value as string));
  };

  return {
    assets,
    registries,
    selectedAsset,
    selectedRegistry,
    isBridgeEnabled,
    isSelectedRegistry,
    bridgeInLabel,
    bridgeInPlaceholder,
    registryLabel,
    registryPlaceholder,
    selectAssetText,
    transferInstructionsLabel,
    registryInstructions,
    narTransferInstructions,
    handleChangeAsset,
    handleChangeRegistry,
  };
};
