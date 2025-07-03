import { useTranslation } from "next-i18next";

export const useTranslations = (namespace: string) => {
  const { t } = useTranslation(namespace);

  return {
    wallet: t(`${namespace}:assets`),
    pageTitle: t(`${namespace}:pageTitle`),
    pageTitleDescription: t(`${namespace}:pageTitleDescription`),
    noBanksYet: t(`${namespace}:noBanksYet`),
  };
};
