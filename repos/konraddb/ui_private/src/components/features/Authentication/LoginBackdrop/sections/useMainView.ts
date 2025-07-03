import { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import { login } from "@/services/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  AuthErrorCodes,
  clearErrorCode,
  selectAuthErrorCode,
  selectIsTwoFactorAuth,
} from "@/store/auth";
import { createEmail } from "@/utils/email";

import { LoginBackdropViews } from "../useLoginBackdropContents";

interface UseVerifyViewProps {
  setView: (view: LoginBackdropViews) => void;
}

interface FormProps {
  email: string;
  password: string;
}

const mainViewSchema = yup.object({
  email: yup.string().email(":emailInvalid").required(":required"),
  password: yup.string().required(":required").min(8, ":tooShortPassword"),
});

const initialValues = {
  email: "",
  password: "",
};

export const useMainView = ({ setView }: UseVerifyViewProps) => {
  const dispatch = useAppDispatch();
  const isTwoFactorAuth = useAppSelector(selectIsTwoFactorAuth);
  const authErrorCode = useAppSelector(selectAuthErrorCode);

  const handleForgotPassword = () => {
    window.location.href = createEmail(
      formik.values.email,
      "Forgot Password",
      ""
    );
  };

  const onSubmit = async (values: FormProps) => {
    const loginRequestCredentials = {
      email: values.email,
      password: values.password,
    };

    dispatch(clearErrorCode());
    await dispatch(login(loginRequestCredentials));

    formik.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: mainViewSchema,
    onSubmit,
  });

  useEffect(() => {
    if (!isTwoFactorAuth) return;

    setView(LoginBackdropViews.Verify);
  }, [isTwoFactorAuth]);

  useEffect(() => {
    if (!authErrorCode) return;

    const errorMessageKey = AuthErrorCodes[authErrorCode] ?? authErrorCode;

    formik.setErrors({
      email: errorMessageKey,
      password: errorMessageKey,
    });
  }, [authErrorCode]);

  return {
    formik,
    handleForgotPassword,
  };
};
