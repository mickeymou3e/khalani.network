import { useTranslation } from "next-i18next";

export const useTranslations = (namespace: string) => {
  const { t } = useTranslation(namespace);

  return {
    t,

    // Verify view
    verifyViewTitle: t(`${namespace}:verifyViewTitle`),
    verifyViewSubtitle: t(`${namespace}:verifyViewSubtitle`),
    disclaimer: t(`${namespace}:disclaimer`),
    discalimerList1: t(`${namespace}:discalimerList1`),
    discalimerList2: t(`${namespace}:discalimerList2`),
    verifyViewPrimaryButton: t(`${namespace}:verifyViewPrimaryButton`),
    verifyViewSecondaryButton: t(`${namespace}:verifyViewSecondaryButton`),

    // Success view
    successViewTitle: t(`${namespace}:successViewTitle`),
    successViewSubtitle: t(`${namespace}:successViewSubtitle`),
    successViewPrimaryButton: t(`${namespace}:successViewPrimaryButton`),

    // Error view
    errorViewTitle: t(`${namespace}:errorViewTitle`),
    errorViewSubtitle: t(`${namespace}:errorViewSubtitle`),
    errorViewPrimaryButton: t(`${namespace}:errorViewPrimaryButton`),
  };
};
