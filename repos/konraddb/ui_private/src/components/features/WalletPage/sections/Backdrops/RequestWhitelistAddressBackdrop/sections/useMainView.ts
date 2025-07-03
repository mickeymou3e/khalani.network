import { useFormik } from "formik";
import WAValidator from "multicoin-address-validator";
import * as yup from "yup";

import { WhitelistAddressRequestProps } from "@/services/wallet";
import { useAppDispatch, useAppSelector } from "@/store";
import { hideBackdrop } from "@/store/backdrops/backdrops.store";
import { selectCryptoBalanceAssets } from "@/store/balances";
import { selectSelectedAsset, setSelectedAsset } from "@/store/wallet";
import { selectRawCryptoWithdrawalAddresses } from "@/store/wallet/wallet.selectors";

import {
  backdropinitialValues,
  RequestWhitelistAddressBackdropViews,
} from "../useRequestWhitelistAddressBackdrop";

interface UseVerifyViewProps {
  setView: (view: RequestWhitelistAddressBackdropViews) => void;
  setCredentials: (credentials: WhitelistAddressRequestProps) => void;
}

export const useMainView = ({
  setView,
  setCredentials,
}: UseVerifyViewProps) => {
  const dispatch = useAppDispatch();

  const withdrawalsAddresses = useAppSelector(
    selectRawCryptoWithdrawalAddresses
  );
  const selectedAsset = useAppSelector(selectSelectedAsset);
  const assets = useAppSelector(selectCryptoBalanceAssets);

  const fiatWithdrawalSchema = yup.object({
    currency: yup.string().required(":required"),
    address: yup
      .string()
      .required(":required")
      .test("is-address-correct-validation", ":invalidAddress", (value) => {
        const isAddressValid = WAValidator.validate(value, "matic");

        return isAddressValid;
      })
      .test(
        "is-address-exists-validation",
        ":addressAlreadyExists",
        (value) => !withdrawalsAddresses.some((data) => data.address === value)
      ),
    label: yup.string().required(":required"),
  });

  const initialValues = { ...backdropinitialValues, currency: selectedAsset };

  const handleSelect = (value: any) => {
    formik.setFieldValue("currency", value);
    formik.setFieldValue("address", "");
    formik.setFieldValue("label", "");
    dispatch(setSelectedAsset(value));
  };

  const onSubmit = () => {
    setCredentials(formik.values);

    setView(RequestWhitelistAddressBackdropViews.Verify);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: fiatWithdrawalSchema,
    onSubmit,
  });

  const handleCancel = () => {
    dispatch(hideBackdrop());
    dispatch(setSelectedAsset(""));
  };

  return {
    formik,
    assets,
    handleCancel,
    handleSelect,
  };
};
