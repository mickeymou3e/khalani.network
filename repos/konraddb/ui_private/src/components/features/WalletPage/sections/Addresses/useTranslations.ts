import { useTranslation } from "next-i18next";

export const useTranslations = (namespace: string) => {
  const { t } = useTranslation(namespace);

  return {
    assets: t(`${namespace}:assets`),
    pageTitle: t(`${namespace}:pageTitle`),
    pageTitleDescription: t(`${namespace}:pageTitleDescription`),
    newWallet: t(`${namespace}:newWallet`),
    addNew: t(`${namespace}:addNew`),
    add: t(`${namespace}:add`),
    addresses: t(`${namespace}:addresses`),
    noAddressesYet: t(`${namespace}:noAddressesYet`),
  };
};
