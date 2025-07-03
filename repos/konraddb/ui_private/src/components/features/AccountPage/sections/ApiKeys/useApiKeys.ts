import { useTranslation } from "next-i18next";

import { Backdrops } from "@/definitions/types";
import { useAppDispatch } from "@/store";
import { openBackdrop } from "@/store/backdrops/backdrops.store";

import { namespace } from "./config";

export const useApiKeys = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(namespace);
  const accountLabel = t(`${namespace}:account`);
  const apiKeysLabel = t(`${namespace}:apiKeys`);
  const newApiKeyLabel = t(`${namespace}:newApiKey`);
  const apiKeysDescription = t(`${namespace}:apiKeysDescription`);

  const handleAddNewApiKey = () => {
    dispatch(openBackdrop(Backdrops.CREATE_NEW_API_KEY));
  };

  return {
    accountLabel,
    apiKeysLabel,
    newApiKeyLabel,
    apiKeysDescription,
    handleAddNewApiKey,
  };
};
