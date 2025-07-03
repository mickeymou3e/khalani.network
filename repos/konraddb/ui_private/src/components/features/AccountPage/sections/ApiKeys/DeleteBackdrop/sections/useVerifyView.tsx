import { useTranslation } from "next-i18next";

import { namespace } from "../../config";

export const useVerifyView = () => {
  const { t } = useTranslation(namespace);

  return {
    verifyTitle: t(`${namespace}:verifyTitle`),
    verifySubtitle: t(`${namespace}:verifySubtitle`),
    deleteApiKey: t(`${namespace}:deleteApiKey`),
  };
};
