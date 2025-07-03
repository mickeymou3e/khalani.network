import { useTranslation } from "next-i18next";

import { useFilterGrid } from "@/components/molecules";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin } from "@/store/auth";
import { changeAuxilliaryPageSize, selectAuxilliaryPageSize } from "@/store/ui";

import { selectRetireHistory } from "../store/retire.selectors";
import { createColumnConfig, namespace } from "./config";

export const useHistory = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const rawDataProvider = useAppSelector(selectRetireHistory);
  const { dataProvider, searchKeyword, setSearchKeyword } =
    useFilterGrid(rawDataProvider);
  const pageSize = useAppSelector(selectAuxilliaryPageSize);
  const columns = createColumnConfig(t);

  const titleLabel = t(`${namespace}:title`);
  const searchTooltip = t(`${namespace}:searchTooltip`);
  const noHistoryText = t(`${namespace}:noHistory`);
  const loginText = t(`${namespace}:login`);
  const actionText = t(`${namespace}:loginToStartRetiring`);

  const handlePageSizeChange = (pageSize: unknown) => {
    dispatch(changeAuxilliaryPageSize(pageSize as number));
  };

  return {
    columns,
    dataProvider,
    isLoggedIn,
    titleLabel,
    searchTooltip,
    noHistoryText,
    loginText,
    actionText,
    searchKeyword,
    pageSize,
    setSearchKeyword,
    handlePageSizeChange,
  };
};
