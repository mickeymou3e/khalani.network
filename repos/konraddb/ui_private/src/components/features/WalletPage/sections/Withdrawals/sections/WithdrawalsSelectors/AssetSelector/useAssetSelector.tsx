import { useCallback, useRef } from "react";
import { FormikProps } from "formik";
import { useTranslation } from "next-i18next";

import { PopoverActions } from "@mui/material";

import { Asset, BasicInfoPopover } from "@/components/molecules";
import { Symbols } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectBalancesList
} from "@/store/balances";
import { selectSelectedAssetAvailableWithdrawalBalance } from "@/store/balances/balances.selectors";
import { setSelectedAsset, setSelectedAssetDetails } from "@/store/wallet";

import { namespace } from "./config";

export const useAssetSelector = (
  formik: FormikProps<any>,
  onChange?: (assetKey: string) => void
) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();

  const assets = useAppSelector(selectBalancesList);
  const selectedAssetBalance = useAppSelector(
    selectSelectedAssetAvailableWithdrawalBalance
  );
  const primaryValue = t(`${namespace}:yourWithdraw`);
  const secondaryValue = t(`${namespace}:available`);
  const tertiaryValue = selectedAssetBalance?.assetBalance
    ? selectedAssetBalance?.assetBalance || Symbols.ZeroBalance
    : Symbols.NoBalance;
  const quaternaryValue = (
    <BasicInfoPopover>{t(`${namespace}:info`)}</BasicInfoPopover>
  );
  const placeholderText = t(`${namespace}:selectOption`);
  const assetInfoTextValue = t(`${namespace}:balanceDisclaimer`);

  const popoverActionRef = useRef<PopoverActions>(null);

  const renderSelectedAsset = formik.values.withdrawalAsset
    ? () => (
        <Asset
          asset={{
            label: formik.values.withdrawalAsset,
            icon: formik.values.withdrawalAsset,
          }}
          showDescription={false}
        />
      )
    : undefined;

  const handleViewToggle = useCallback(() => {
    popoverActionRef.current?.updatePosition();
  }, []);

  const handleAssetChange = (onClose: () => void) => (element: any) => {
    formik.resetForm();
    formik.setFieldValue("withdrawalAsset", element.asset);
    formik.setFieldValue("walletAddress", "");
    formik.setFieldValue("amount", "");
    dispatch(setSelectedAsset(element.asset));
    dispatch(setSelectedAssetDetails(null));
    onChange?.(element.id);
    onClose();
  };

  return {
    assets,
    primaryValue,
    secondaryValue,
    tertiaryValue,
    quaternaryValue,
    popoverActionRef,
    placeholderText,
    assetInfoTextValue,
    renderSelectedAsset,
    handleAssetChange,
    handleViewToggle,
  };
};
