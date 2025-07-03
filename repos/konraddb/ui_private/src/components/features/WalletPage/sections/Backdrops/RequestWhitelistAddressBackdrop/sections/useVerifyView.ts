import { useEffect } from "react";
import { useFormik } from "formik";

import { toUnderscore } from "@/definitions/config";
import { RequestStatusProps } from "@/definitions/types";
import {
  getCryptoWithdrawalAddressess,
  whitelistAddress,
  WhitelistAddressRequestProps,
} from "@/services/wallet";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectFirstAwailableWalletCode,
  selectRequestStatus,
} from "@/store/wallet";
import { authCodeSchema } from "@/utils/formik";

import { RequestWhitelistAddressBackdropViews } from "../useRequestWhitelistAddressBackdrop";

interface UseVerifyViewProps {
  setView: (view: RequestWhitelistAddressBackdropViews) => void;
  credentials: WhitelistAddressRequestProps;
}

const initialValues = {
  code: "",
};

export const useVerifyView = ({ setView, credentials }: UseVerifyViewProps) => {
  const dispatch = useAppDispatch();

  const whitelistAddressStatus = useAppSelector(selectRequestStatus);
  const firstAwailableWalletCode = useAppSelector(
    selectFirstAwailableWalletCode
  );

  useEffect(() => {
    if (whitelistAddressStatus === RequestStatusProps.SUCCESS) {
      setView(RequestWhitelistAddressBackdropViews.Success);

      setTimeout(() => {
        dispatch(getCryptoWithdrawalAddressess());
      }, 1000);
    }
    if (whitelistAddressStatus === RequestStatusProps.FAILED) {
      setView(RequestWhitelistAddressBackdropViews.Error);
    }
  }, [whitelistAddressStatus]);

  const onSubmit = () => {
    if (!firstAwailableWalletCode) return;

    const requestBody = {
      ...credentials,
      currency: toUnderscore(credentials.currency),
      totp_code: formik.values.code,
      wallet_code: firstAwailableWalletCode,
    };

    dispatch(whitelistAddress(requestBody));
  };

  const formik = useFormik({
    initialValues,
    validationSchema: authCodeSchema,
    onSubmit,
  });

  return {
    formik,
  };
};
