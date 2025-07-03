import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { Backdrops } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  openBackdrop,
  selectCurrentBackdrop,
  setParameters,
} from "@/store/backdrops";
import { selectSelectedAssetAvailableWithdrawalBalance } from "@/store/balances/balances.selectors";
import {
  selectIsAssetFiat,
  selectSelectedAsset,
  selectSelectedAssetDetails,
} from "@/store/wallet";

export enum WithdrawalTypes {
  Crypto = "Crypto",
  Fiat = "Fiat",
}

interface FormProps {
  withdrawalAsset: string;
  walletAddress: string;
  fees: string;
  amount: string;
  isAddressValid: boolean;
}

export const cryptoWithdrawalSchema = (
  selectedAssetBalance: number | undefined
) =>
  yup.object({
    withdrawalAsset: yup.string().required(":required"),
    walletAddress: yup.string().required(":required"),
    amount: yup
      .number()
      .moreThan(0, ":moreThanZero")
      .max(Number(selectedAssetBalance), ":insufficientBalance")
      .required(":required"),
    isAddressValid: yup.boolean().oneOf([true], ":required"),
  });

export const fiatWithdrawalSchema = (
  selectedAssetBalance: number | undefined
) =>
  yup.object({
    withdrawalAsset: yup.string().required(":required"),
    amount: yup
      .number()
      .moreThan(0, ":moreThanZero")
      .max(Number(selectedAssetBalance), ":insufficientBalance")
      .required(":required"),
  });

export const useWithdrawals = () => {
  const dispatch = useAppDispatch();

  const selectedAsset = useAppSelector(selectSelectedAsset);
  const selectedAssetDetails = useAppSelector(selectSelectedAssetDetails);
  const selectedAssetBalance = useAppSelector(
    selectSelectedAssetAvailableWithdrawalBalance
  );
  const currentBackdrop = useAppSelector(selectCurrentBackdrop);
  const isFiat = useAppSelector(selectIsAssetFiat);

  const initialValues = {
    withdrawalAsset: selectedAsset ?? "",
    walletAddress: "",
    fees: "medium",
    amount: "",
    isAddressValid: false,
  } as FormProps;

  const formik = useFormik({
    initialValues,
    validationSchema: isFiat
      ? fiatWithdrawalSchema(selectedAssetBalance?.assetBalanceValue)
      : cryptoWithdrawalSchema(selectedAssetBalance?.assetBalanceValue),
    validateOnChange: true,
    onSubmit: () => {
      const requestBody = {
        address_code: selectedAssetDetails?.code,
        amount: formik.values.amount.toString(),
        currency: selectedAssetDetails?.currency,
        fee_level: formik.values.fees,
        custom_fee_size: "",
        reference_id: "",
        wallet_code: selectedAssetDetails?.wallet_code,
      };

      dispatch(setParameters(requestBody));
      dispatch(openBackdrop(Backdrops.REQUEST_WITHDRAWAL));
    },
  });

  useEffect(() => {
    if (currentBackdrop === Backdrops.REQUEST_WHITELIST_ADDRESS) {
      formik.resetForm();
    }
  }, [currentBackdrop]);

  return {
    formik,
    isFiat,
  };
};
