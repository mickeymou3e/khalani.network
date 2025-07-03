import { useTranslation } from "next-i18next";

import { namespace } from "../../config";

export const useSuccessView = () => {
  const { t } = useTranslation(namespace);

  return {
    verifyApiKeyCreated: t(`${namespace}:verifyApiKeyCreated`),
    successSubtitle: t(`${namespace}:successSubtitle`),
    backToApiKeys: t(`${namespace}:backToApiKeys`),
  };
};
