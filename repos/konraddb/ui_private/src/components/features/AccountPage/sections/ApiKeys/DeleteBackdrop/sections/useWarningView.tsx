import { useTranslation } from "next-i18next";

import { namespace } from "../../config";

export const useWarningView = () => {
  const { t } = useTranslation(namespace);

  return {
    warningTitle: t(`${namespace}:warningTitle`),
    warningSubtitle: t(`${namespace}:warningSubtitle`),
    warningSubtitle2: t(`${namespace}:warningSubtitle2`),
    content1: t(`${namespace}:content1`),
    content2: t(`${namespace}:content2`),
    next: t(`${namespace}:next`),
    cancel: t(`${namespace}:cancel`),
  };
};
