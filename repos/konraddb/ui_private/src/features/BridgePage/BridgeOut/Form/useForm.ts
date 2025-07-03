import { useEffect } from "react";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import { useLoggedOutEffect } from "@/hooks/account";
import { selectCustomer } from "@/services/account";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser } from "@/store/account";
import { selectIsValidLogin, selectNeutralFeatures } from "@/store/auth";
import { createGetInputProps } from "@/utils/formik";
import { evaluate } from "@/utils/logic";

import {
  resetSelection,
  selectionAssetAdded,
  selectRemainingForBridgeOut,
  selectSelectedRegistryAsset,
} from "../../store";

export const namespace = "bridge-page:bridgeOut";

export const makeValidationSchema = (assetBalance: number | undefined) =>
  yup.object({
    selectedAssetKey: yup.string().required(":required"),
    amount: yup
      .number()
      .min(1, ":minimumBridgeAmount")
      .max(Number(assetBalance), ":insufficientRemainingAssets")
      .test((value, context) => {
        if (!value) return true;

        return value % 1 !== 0
          ? context.createError({ message: ":cannotBridgeDecimals" })
          : true;
      })
      .required(":required"),
    isAddressValid: yup.boolean().oneOf([true], ":required"),
  });

const useForm = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const featureFlags = useAppSelector(selectNeutralFeatures);
  const isAdmin = useAppSelector(selectIsAdminUser);
  const isBridgeEnabled = featureFlags.bridge && isLoggedIn && isAdmin;
  const selectedRegistryAsset = useAppSelector(selectSelectedRegistryAsset);
  const neutralCustomer = useAppSelector(selectCustomer);
  const remaining = useAppSelector(selectRemainingForBridgeOut);

  const amountText = t(`${namespace}:amount`);
  const remainingText = t(`${namespace}:remaining`);
  const maxLabel = t(`${namespace}:max`);
  const submitText = t(`${namespace}:addToBridgeList`);
  const registryLabel = t(`${namespace}:registry`);
  const accountLabel = t(`${namespace}:account`);
  const accountInfoText = t(`${namespace}:accountInfoText`);

  const initialValues = {
    selectedAssetKey: "",
    amount: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: makeValidationSchema(remaining.value),
    onSubmit: ({ selectedAssetKey, amount }, { resetForm }) => {
      dispatch(
        selectionAssetAdded({
          asset: selectedAssetKey,
          amount: parseFloat(amount),
        })
      );
      resetForm();
    },
  });
  const isNoAssetSelected = formik.values.selectedAssetKey === "";
  const getInputProps = createGetInputProps(t, formik, namespace);
  const isSubmitDisabled =
    !formik.isValid || !formik.dirty || !isLoggedIn || !isAdmin;
  const registryPlaceholder = isNoAssetSelected
    ? t(`${namespace}:selectAsset`)
    : "";
  const companyPlaceholder = evaluate<string>(
    [true, ""],
    [!isAdmin, t(`${namespace}:notEnoughPermission`)],
    [isNoAssetSelected, t(`${namespace}:selectAsset`)],
    [!isLoggedIn, t(`${namespace}:login`)]
  );
  const companyText =
    isLoggedIn && !isNoAssetSelected && isAdmin
      ? neutralCustomer?.company_name
      : "";

  const maxAmountWithoutDecimals = Math.floor(remaining.value ?? 0);
  const isMaxAmountReached =
    Math.floor(Number(formik.values.amount)) >= maxAmountWithoutDecimals;

  const handleUseMaxAmount = () => {
    formik.setFieldValue("amount", maxAmountWithoutDecimals);
  };

  const handleAssetChange = (assetKey: string) => {
    formik.resetForm();
    formik.setFieldValue("selectedAssetKey", assetKey);
    formik.setFieldValue("amount", "");
  };

  useEffect(() => {
    if (selectedRegistryAsset) return;

    formik.resetForm();
  }, [selectedRegistryAsset]);

  useEffect(
    () => () => {
      dispatch(resetSelection());
    },
    []
  );

  useLoggedOutEffect(() => formik.resetForm());

  return {
    formik,
    isSubmitDisabled,
    isBridgeEnabled,
    isNoAssetSelected,
    selectedRegistryAsset,
    remaining,
    companyText,
    amountText,
    remainingText,
    maxLabel,
    submitText,
    registryPlaceholder,
    companyPlaceholder,
    registryLabel,
    accountLabel,
    accountInfoText,
    isMaxAmountReached,
    getInputProps,
    handleUseMaxAmount,
    handleAssetChange,
  };
};

export default useForm;
