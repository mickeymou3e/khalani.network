import { useEffect } from "react";
import { FormikProps } from "formik";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { createGetInputProps } from "@/utils/formik";

import { namespace } from "../config";
import { RegisterFormProps, replaceSpaceWithPlus } from "../useRegisterPage";

export const useMainView = (formik: FormikProps<RegisterFormProps>) => {
  const { t } = useTranslation();
  const signupTitle = t(`${namespace}:signup`);
  const firstNameLabel = t(`${namespace}:firstName`);
  const firstNamePlaceholder = t(`${namespace}:firstNamePlaceholder`);
  const emailLabel = t(`${namespace}:email`);
  const passwordLabel = t(`${namespace}:password`);
  const passwordPlaceholder = t(`${namespace}:passwordPlaceholder`);
  const confirmPasswordLabel = t(`${namespace}:confirmPassword`);
  const confirmPasswordPlaceholder = t(
    `${namespace}:confirmPasswordPlaceholder`
  );
  const passwordHintText = t(`${namespace}:passwordHintText`);
  const nextButtonLabel = t(`${namespace}:next`);

  const router = useRouter();
  const email = router.query.email as string;

  const formattedEmail = replaceSpaceWithPlus(email);

  useEffect(() => {
    formik.validateForm();
  }, []);

  const getInputProps = createGetInputProps(t, formik, namespace);
  const actionButtonDisabled =
    !formik.dirty || (formik.dirty && !formik.isValid);

  return {
    signupTitle,
    firstNameLabel,
    firstNamePlaceholder,
    emailLabel,
    passwordLabel,
    passwordPlaceholder,
    confirmPasswordLabel,
    confirmPasswordPlaceholder,
    actionButtonDisabled,
    nextButtonLabel,
    passwordHintText,
    formattedEmail,
    getInputProps,
  };
};
