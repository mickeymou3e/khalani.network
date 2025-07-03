import { useTranslation } from "next-i18next";

export const useLoginBackdropTranslations = (namespace: string) => {
  const { t } = useTranslation(namespace);

  return {
    t,
    login: t(`${namespace}:login`),
    email: t(`${namespace}:email`),
    password: t(`${namespace}:password`),
    enterPassword: t(`${namespace}:enterPassword`),
    next: t(`${namespace}:next`),
    forgotPassword: t(`${namespace}:forgotPassword`),

    verifyToLogin: t(`${namespace}:verifyToLogin`),
    emailCodeWasSent: t(`${namespace}:emailCodeWasSent`),
    authenticatorCodeWasSent: t(`${namespace}:authenticatorCodeWasSent`),

    verifyYourId: t(`${namespace}:verifyYourId`),
    verifyYourIdDescription: t(`${namespace}:verifyYourIdDescription`),
    verify: t(`${namespace}:verify`),
    remindMeLater: t(`${namespace}:remindMeLater`),

    blockedViewTitle: t(`${namespace}:blockedViewTitle`),
    blockedViewDescription: t(`${namespace}:blockedViewDescription`),
    goToHome: t(`${namespace}:goToHome`),
    resetMyPassword: t(`${namespace}:resetMyPassword`),
  };
};
