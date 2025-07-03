import { useTranslation } from "next-i18next";

import { namespace } from "./config";

export const useProfile = () => {
  const { t } = useTranslation(namespace);

  const accountLabel = t(`${namespace}:account`);
  const profileLabel = t(`${namespace}:profile`);

  return {
    accountLabel,
    profileLabel,
  };
};
