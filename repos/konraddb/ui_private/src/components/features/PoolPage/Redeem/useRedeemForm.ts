import { useEffect } from "react";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import { useLoggedOutEffect } from "@/hooks/account";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin, selectNeutralFeatures } from "@/store/auth";
import { resetSelection, selectionAssetAdded } from "@/store/pool";
import { formatValue } from "@/utils/formatters";
import { createGetInputProps } from "@/utils/formik";

import {
  selectRemainingForRedemption,
  selectSelectedAsset,
  selectSelectedPoolData,
} from "../store/pool.selectors";
import { namespace } from "./config";

export const makeValidationSchema = (assetBalance: number | undefined) =>
  yup.object({
    selectedAssetKey: yup.string().required(":required"),
    selectedPoolKey: yup.string().required(":required"),
    amount: yup
      .number()
      .min(1, ":minimumRedeemAmount")
      .max(Number(assetBalance), ":insufficientRemainingAssets")
      .test((value, context) => {
        if (!value) return true;

        return value % 1 !== 0
          ? context.createError({ message: ":cannotRedeemDecimals" })
          : true;
      })
      .required(":required"),
    isAddressValid: yup.boolean().oneOf([true], ":required"),
  });

const useRedeemForm = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const selectedAsset = useAppSelector(selectSelectedAsset);
  const selectedPoolData = useAppSelector(selectSelectedPoolData);
  const featureFlags = useAppSelector(selectNeutralFeatures);
  const isDisabled = !isLoggedIn || !featureFlags.redeem;
  const initialValues = {
    selectedAssetKey: "",
    selectedPoolKey: "",
    amount: "",
  };

  const remaining = useAppSelector(selectRemainingForRedemption);

  const amountText = t(`${namespace}:amount`);
  const remainingText = t(`${namespace}:remaining`);
  const assetSelectorLabel = t(`${namespace}:assetSelectorLabel`);
  const poolSelectorLabel = t(`${namespace}:poolSelectorLabel`);
  const submitText = t(`${namespace}:submitForm`);
  const maxLabel = t(`${namespace}:max`);

  const formik = useFormik({
    initialValues,
    validationSchema: makeValidationSchema(remaining.value),
    onSubmit: (
      { selectedPoolKey, selectedAssetKey, amount },
      { resetForm }
    ) => {
      dispatch(
        selectionAssetAdded({
          poolKey: selectedPoolKey,
          assetKey: selectedAssetKey,
          amount: parseFloat(amount),
        })
      );

      resetForm();
    },
  });
  const getInputProps = createGetInputProps(t, formik, namespace);
  const isNoAssetSelected = !formik.values.selectedAssetKey;
  const isNoPoolSelected = !formik.values.selectedPoolKey;
  const newAmount = Number(formik.values.amount);
  const newAmountText = formatValue(Number(formik.values.amount));
  const infoText = t(`${namespace}:info`, {
    poolAssetValue: newAmountText,
    poolAssetName: selectedPoolData?.assetName,
    assetValue: newAmountText,
    assetName: selectedAsset?.generator,
    count: newAmount,
  });
  const shouldShowInfoText = Boolean(newAmount) && formik.isValid;

  const maxAmountWithoutDecimals = Math.floor(remaining.value ?? 0);
  const isMaxAmountReached =
    Math.floor(Number(formik.values.amount)) >= maxAmountWithoutDecimals;

  const handleUseMaxAmount = () => {
    formik.setFieldValue("amount", maxAmountWithoutDecimals);
  };

  const handleAssetChange = (assetKey: string) => {
    formik.setTouched({}, false);
    formik.setFieldValue("selectedAssetKey", assetKey);
  };

  const handlePoolChange = (poolKey: string) => {
    formik.setFieldValue("selectedPoolKey", poolKey);
    formik.setFieldValue("amount", "");
  };

  useEffect(
    () => () => {
      dispatch(resetSelection());
    },
    []
  );

  useEffect(() => {
    if (selectedAsset) return;

    formik.resetForm();
  }, [selectedAsset]);

  useLoggedOutEffect(() => {
    formik.resetForm();
    dispatch(resetSelection());
  });

  return {
    formik,
    isDisabled,
    isNoAssetSelected,
    isNoPoolSelected,
    remaining,
    amountText,
    remainingText,
    assetSelectorLabel,
    poolSelectorLabel,
    maxLabel,
    submitText,
    infoText,
    shouldShowInfoText,
    isMaxAmountReached,
    getInputProps,
    handleUseMaxAmount,
    handleAssetChange,
    handlePoolChange,
  };
};

export default useRedeemForm;
