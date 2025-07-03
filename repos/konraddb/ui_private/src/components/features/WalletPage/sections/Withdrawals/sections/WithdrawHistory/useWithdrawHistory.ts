import { useEffect } from "react";
import { useTranslation } from "next-i18next";

import { subscribeWithdrawalsHistory } from "@/services/wallet";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser } from "@/store/account/account.selectors";
import { selectWalletPageSize } from "@/store/ui/ui.selectors";
import { changeWalletPageSize } from "@/store/ui/ui.store";
import { selectWithdrawalsHistoryWithExplorerUrl } from "@/store/wallet";

import { namespace } from "../../config";
import { createColumnConfig } from "./config";

export const useWithdrawHistory = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(namespace);
  const isAdmin = useAppSelector(selectIsAdminUser);
  const columnConfig = createColumnConfig(isAdmin, t);

  const dataProvider = useAppSelector(selectWithdrawalsHistoryWithExplorerUrl);
  const pageSize = useAppSelector(selectWalletPageSize);

  useEffect(() => {
    const withdrawHistory = dispatch(subscribeWithdrawalsHistory());

    return () => {
      withdrawHistory.unsubscribe();
    };
  }, [dispatch]);

  const handlePageSizeChange = (pageSize: unknown) => {
    dispatch(changeWalletPageSize(pageSize as number));
  };

  return {
    dataProvider,
    columnConfig,
    pageSize,
    handlePageSizeChange,
  };
};
