import { useTranslation } from "next-i18next";

export const useTranslations = (namespace: string) => {
  const { t } = useTranslation(namespace);

  return {
    t,

    // Verify view
    verifyViewTitle: t(`${namespace}:verifyViewTitle`),
    verifyViewSubtitle: t(`${namespace}:verifyViewSubtitle`),
    verifyViewPrimaryButton: t(`${namespace}:verifyViewPrimaryButton`),

    // Success view
    successViewTitle: t(`${namespace}:successViewTitle`),
    successViewSubtitle: t(`${namespace}:successViewSubtitle`),
    successViewPrimaryButton: t(`${namespace}:successViewPrimaryButton`),

    // Error view
    errorViewTitle: t(`${namespace}:errorViewTitle`),
    errorViewSubtitle: t(`${namespace}:errorViewSubtitle`),
    errorViewPrimaryButton: t(`${namespace}:errorViewPrimaryButton`),
    errorViewSecondaryButton: t(`${namespace}:errorViewSecondaryButton`),
  };
};
