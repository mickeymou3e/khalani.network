import { useTranslation } from "next-i18next";

import { Backdrops } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectApiTokens } from "@/store/account/account.selectors";
import { openBackdrop, setParameters } from "@/store/backdrops";
import { selectAccountPageSize } from "@/store/ui/ui.selectors";
import { changeAccountPageSize } from "@/store/ui/ui.store";

import { namespace } from "../config";
import { createColumnConfig } from "./config";

export const useApiKeysList = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(namespace);
  const dataProvider = useAppSelector(selectApiTokens) || [];
  const apiKeysLabel = t(`${namespace}:apiKeys`);
  const noApiKeyLabel = t(`${namespace}:noApiKey`);
  const apiLabelLabel = t(`${namespace}:apiLabel`);
  const apiKeyLabel = t(`${namespace}:apiKey`);
  const addLabel = t(`${namespace}:addLabel`);
  const columnConfig = createColumnConfig(t);
  const pageSize = useAppSelector(selectAccountPageSize);

  const handleRemoveApiKey = (key: string) => {
    dispatch(setParameters(key));
    dispatch(openBackdrop(Backdrops.DELETE_API_KEY));
  };

  const handlePageSizeChange = (pageSize: unknown) => {
    dispatch(changeAccountPageSize(pageSize as number));
  };

  return {
    dataProvider,
    apiKeysLabel,
    noApiKeyLabel,
    apiLabelLabel,
    apiKeyLabel,
    addLabel,
    columnConfig,
    pageSize,
    handlePageSizeChange,
    handleRemoveApiKey,
  };
};
