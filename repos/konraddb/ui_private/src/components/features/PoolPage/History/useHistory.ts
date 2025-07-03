import { useTranslation } from "next-i18next";

import { useFilterGrid } from "@/components/molecules";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin } from "@/store/auth";
import { PoolModes } from "@/store/pool";
import { changeAuxilliaryPageSize, selectAuxilliaryPageSize } from "@/store/ui";

import { selectMode, selectPoolHistory } from "../store/pool.selectors";
import { createColumnConfig, namespace } from "./config";

export const useHistory = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const history = useAppSelector(selectPoolHistory);
  const mode = useAppSelector(selectMode);
  const isDeposit = mode === PoolModes.Deposit;
  const rawDataProvider = isDeposit ? history.pooling : history.redemption;
  const { dataProvider, searchKeyword, setSearchKeyword } =
    useFilterGrid(rawDataProvider);
  const pageSize = useAppSelector(selectAuxilliaryPageSize);
  const columns = createColumnConfig(isDeposit, t);

  const titleLabel = t(`${namespace}:title`);
  const searchTooltip = t(`${namespace}:searchTooltip`);
  const noHistoryText = t(`${namespace}:noHistory`);
  const loginText = t(`${namespace}:login`);
  const actionText = t(`${namespace}:loginToStartPooling`);

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
