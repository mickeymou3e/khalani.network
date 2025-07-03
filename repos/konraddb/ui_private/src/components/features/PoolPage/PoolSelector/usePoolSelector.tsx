import { useCallback, useRef } from "react";
import { useTranslation } from "next-i18next";

import { PopoverActions } from "@mui/material";

import { Asset, BasicInfoPopover } from "@/components/molecules";
import { Symbols } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCryptoBalancesList } from "@/store/balances";
import { selectedPoolKeyChanged } from "@/store/pool";

import {
  selectSelectedPoolBalance,
  selectSelectedPoolKey,
} from "../store/pool.selectors";
import { namespace } from "./config";

export const usePoolSelector = (onChange?: (assetKey: string) => void) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();

  const assets = useAppSelector(selectCryptoBalancesList);

  const selectedPoolKey = useAppSelector(selectSelectedPoolKey);
  const selectedPoolBalance = useAppSelector(selectSelectedPoolBalance);

  const placeholderText = t(`${namespace}:placeholder`);

  const secondaryValue = t(`${namespace}:available`);
  const tertiaryValue = selectedPoolBalance?.balance ?? Symbols.NoBalance;
  const quaternaryValue = (
    <BasicInfoPopover>{t(`${namespace}:info`)}</BasicInfoPopover>
  );
  const infoText = t(`${namespace}:info`);

  const popoverActionRef = useRef<PopoverActions>(null);

  const renderSelectedAsset = selectedPoolKey
    ? () => (
        <Asset
          asset={{
            label: selectedPoolKey,
            icon: selectedPoolKey,
          }}
          showDescription={false}
        />
      )
    : undefined;

  const handleViewToggle = useCallback(() => {
    popoverActionRef.current?.updatePosition();
  }, []);

  const handleAssetChange =
    (onClose: () => void) =>
    ({ id }: { id: string }) => {
      dispatch(selectedPoolKeyChanged(id));
      onChange?.(id);
      onClose();
    };

  return {
    assets,
    secondaryValue,
    tertiaryValue,
    quaternaryValue,
    infoText,
    popoverActionRef,
    placeholderText,
    selectedPoolKey,
    renderSelectedAsset,
    handleAssetChange,
    handleViewToggle,
  };
};
