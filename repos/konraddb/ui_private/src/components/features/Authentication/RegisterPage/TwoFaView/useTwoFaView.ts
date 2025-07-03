import { useEffect } from "react";
import { FormikProps } from "formik";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { selectTotpSecretCode } from "@/services/register";
import { useAppSelector } from "@/store";
import { createGetInputProps } from "@/utils/formik";

import { namespace } from "../config";
import { RegisterFormProps, replaceSpaceWithPlus } from "../useRegisterPage";

export const useTwoFaView = (formik: FormikProps<RegisterFormProps>) => {
  const { t } = useTranslation(namespace);
  const totpCode = useAppSelector(selectTotpSecretCode);
  const authenticatorTitle = t(`${namespace}:enableAuthenticatorTitle`);
  const authenticatorSubtitle = t(`${namespace}:enableAuthenticatorSubtitle`);
  const qrCodeText = t(`${namespace}:qrCodeText`);
  const authenticatorCode = t(`${namespace}:authenticatorCode`);
  const authenticatorCodeHint = t(`${namespace}:authenticatorCodeHint`);
  const signupButtonText = t(`${namespace}:signup`);

  const router = useRouter();
  const email = router.query.email as string;
  const formattedEmail = replaceSpaceWithPlus(email);
  const qrCodeValue = `otpauth://totp/DLTM:${formattedEmail}?secret=${totpCode}&issuer=DLTM`;

  useEffect(() => {
    formik.validateForm();
    formik.setFieldValue("twoFaCode", "");
    formik.setFieldTouched("twoFaCode", false);
  }, []);

  const getInputProps = createGetInputProps(t, formik, namespace);
  const actionButtonDisabled =
    !formik.dirty || (formik.dirty && !formik.isValid) || formik.isSubmitting;

  return {
    authenticatorTitle,
    authenticatorSubtitle,
    qrCodeText,
    qrCodeValue,
    authenticatorCode,
    authenticatorCodeHint,
    signupButtonText,
    actionButtonDisabled,
    getInputProps,
  };
};
