import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { sendTwoFactorAuth } from "@/services/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  AuthErrorCodes,
  clearErrorCode,
  clearTokens,
  selectAuthErrorCode,
  selectCsrfToken,
  selectIsValidLogin,
  selectLoginToken,
} from "@/store/auth";
import { hideBackdrop } from "@/store/backdrops/backdrops.store";

import { LoginBackdropViews } from "../useLoginBackdropContents";

const verifySchema = yup.object({
  code: yup
    .string()
    .required(":required")
    .min(6, ":codeExacly6Marks")
    .max(6, ":codeExacly6Marks"),
});

interface UseVerifyViewProps {
  setView: (view: LoginBackdropViews) => void;
}

interface VerifyFormProps {
  code: string;
}

const initialValues = {
  code: "",
};

export const useVerifyView = ({ setView }: UseVerifyViewProps) => {
  const dispatch = useAppDispatch();
  const csrfToken = useAppSelector(selectCsrfToken);
  const loginToken = useAppSelector(selectLoginToken);
  const isAuthenticated = useAppSelector(selectIsValidLogin);
  const authErrorCode = useAppSelector(selectAuthErrorCode);

  const handleBack = () => {
    dispatch(clearTokens());
    setView(LoginBackdropViews.Main);
  };

  const onSubmit = async (values: VerifyFormProps) => {
    dispatch(clearErrorCode());
    await dispatch(
      sendTwoFactorAuth({
        totpCode: values.code,
        csrfToken: csrfToken!,
        loginToken: loginToken!,
      })
    );

    formik.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: verifySchema,
    onSubmit,
  });

  useEffect(() => {
    if (!authErrorCode) return;

    const errorMessageKey = AuthErrorCodes[authErrorCode] ?? authErrorCode;

    formik.setErrors({
      code: errorMessageKey,
    });
  }, [authErrorCode]);

  useEffect(() => {
    if (!isAuthenticated) return;

    dispatch(hideBackdrop());
  }, [isAuthenticated]);

  return {
    formik,
    handleBack,
  };
};
