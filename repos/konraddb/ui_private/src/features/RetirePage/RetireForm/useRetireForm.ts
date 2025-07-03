import { useEffect } from "react";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";
import * as yup from "yup";

import {
  resetSelection,
  selectionAssetAdded,
  selectSelectedAsset,
} from "@/features/RetirePage/store";
import { useLoggedOutEffect } from "@/hooks/account";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin, selectNeutralFeatures } from "@/store/auth";
import { createGetInputProps } from "@/utils/formik";

import {
  selectIsPoolTokenSelected,
  selectRemainingForRetirement,
} from "../store/retire.selectors";

export const namespace = "retire-page:form";

export const makeValidationSchema = (remaining: number | undefined) =>
  yup.object({
    selectedAssetKey: yup.string().required(":required"),
    amount: yup
      .number()
      .min(1, ":minimumRetirementAmount")
      .max(Number(remaining), ":insufficientRemainingAssets")
      .test((value, context) => {
        if (!value) return true;

        return value % 1 !== 0
          ? context.createError({ message: ":cannotRetireDecimals" })
          : true;
      })
      .required(":required"),
    isAddressValid: yup.boolean().oneOf([true], ":required"),
  });

const useRetireForm = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const featureFlags = useAppSelector(selectNeutralFeatures);
  const isRetireEnabled = featureFlags.retire && isLoggedIn;
  const isPoolTokenSelected = useAppSelector(selectIsPoolTokenSelected);
  const remaining = useAppSelector(selectRemainingForRetirement);
  const selectedAsset = useAppSelector(selectSelectedAsset);

  const amountText = t(`${namespace}:amount`);
  const remainingText = t(`${namespace}:remaining`);
  const maxLabel = t(`${namespace}:max`);
  const submitText = t(`${namespace}:addToRetireList`);
  const poolTokenInfoBold = t(`${namespace}:poolTokenInfoBold`);
  const poolTokenInfo = t(`${namespace}:poolTokenInfo`);

  const initialValues = {
    selectedAssetKey: "",
    amount: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: makeValidationSchema(remaining?.value),
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
  const isSubmitDisabled = !formik.isValid || !formik.dirty || !isLoggedIn;

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

  useEffect(
    () => () => {
      dispatch(resetSelection);
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
    isSubmitDisabled,
    isRetireEnabled,
    isPoolTokenSelected,
    isNoAssetSelected,
    remaining,
    amountText,
    remainingText,
    maxLabel,
    submitText,
    poolTokenInfoBold,
    poolTokenInfo,
    isMaxAmountReached,
    getInputProps,
    handleUseMaxAmount,
    handleAssetChange,
  };
};

export default useRetireForm;
