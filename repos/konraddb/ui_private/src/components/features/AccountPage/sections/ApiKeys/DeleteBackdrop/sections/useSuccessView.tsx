import { useTranslation } from "next-i18next";

import { namespace } from "../../config";

export const useSuccessView = () => {
  const { t } = useTranslation(namespace);

  return {
    successTitle: t(`${namespace}:successTitle`),
    successSubtitle: t(`${namespace}:successSubtitle`),
    backToApiKeys: t(`${namespace}:backToApiKeys`),
  };
};
