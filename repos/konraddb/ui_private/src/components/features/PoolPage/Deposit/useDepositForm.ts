import { useEffect } from "react";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import { useLoggedOutEffect } from "@/hooks/account";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin, selectNeutralFeatures } from "@/store/auth";
import { selectCryptoBalanceAssets } from "@/store/balances";
import {
  resetSelection,
  selectedPoolKeyChanged,
  selectionAssetAdded,
} from "@/store/pool";
import { formatValue } from "@/utils/formatters";
import { createGetInputProps } from "@/utils/formik";

import {
  selectRemainingForPooling,
  selectSelectedAsset,
  selectSelectedAssetKey,
  selectSelectedPoolData,
  selectSelectedPoolKey,
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
          ? context.createError({ message: ":cannotPoolDecimals" })
          : true;
      })
      .required(":required"),
    isAddressValid: yup.boolean().oneOf([true], ":required"),
  });

const initialValues = {
  selectedAssetKey: "",
  selectedPoolKey: "",
  amount: "",
};

const useDepositForm = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const assetKey = useAppSelector(selectSelectedAssetKey);
  const poolKey = useAppSelector(selectSelectedPoolKey);
  const remaining = useAppSelector(selectRemainingForPooling);
  const selectedAsset = useAppSelector(selectSelectedAsset);
  const selectedPoolData = useAppSelector(selectSelectedPoolData);
  const featureFlags = useAppSelector(selectNeutralFeatures);
  const [jltAssetOption] = useAppSelector(selectCryptoBalanceAssets);
  const [jltAsset] = jltAssetOption?.assets || [];
  const isDisabled = !isLoggedIn || !featureFlags.pool;

  const amountText = t(`${namespace}:amount`);
  const remainingText = t(`${namespace}:remaining`);
  const assetSelectorLabel = t(`${namespace}:assetSelectorLabel`);
  const poolSelectorLabel = t(`${namespace}:poolSelectorLabel`);
  const poolSelectorPlaceholder = t(`${namespace}:placeholder`);
  const maxLabel = t(`${namespace}:max`);
  const submitText = t(`${namespace}:submitForm`);

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
  const isNoAssetSelected = !formik.values.selectedAssetKey;
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

  const getInputProps = createGetInputProps(t, formik, namespace);

  const maxAmountWithoutDecimals = Math.floor(remaining.value ?? 0);
  const isMaxAmountReached =
    Math.floor(Number(formik.values.amount)) >= maxAmountWithoutDecimals;

  const handleUseMaxAmount = () => {
    formik.setFieldValue("amount", maxAmountWithoutDecimals);
  };

  const handleAssetChange = (assetKey: string) => {
    formik.resetForm();
    formik.setFieldValue("selectedAssetKey", assetKey);
    formik.setFieldValue("selectedPoolKey", jltAssetOption?.value);
    formik.setFieldValue("amount", "");
    dispatch(selectedPoolKeyChanged(jltAssetOption?.value));
  };

  useEffect(() => {
    formik.setFieldValue("selectedAssetKey", assetKey);
    formik.setFieldValue("selectedPoolKey", poolKey);
    formik.setFieldValue("amount", "");
  }, [assetKey, poolKey]);

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
    jltAsset,
    isDisabled,
    isNoAssetSelected,
    remaining,
    amountText,
    remainingText,
    assetSelectorLabel,
    poolSelectorLabel,
    poolSelectorPlaceholder,
    maxLabel,
    infoText,
    submitText,
    shouldShowInfoText,
    isMaxAmountReached,
    getInputProps,
    handleUseMaxAmount,
    handleAssetChange,
  };
};

export default useDepositForm;
