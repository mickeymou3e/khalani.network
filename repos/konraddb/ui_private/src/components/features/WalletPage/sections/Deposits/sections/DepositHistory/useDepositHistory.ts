import { useTranslation } from "next-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectJltTokenAddress } from "@/store/ancillary";
import { selectWalletPageSize } from "@/store/ui/ui.selectors";
import { changeWalletPageSize } from "@/store/ui/ui.store";
import {
  DepositHistoryRecordProps,
  selectDepositsHistoryWithExplorerUrl,
} from "@/store/wallet";

import { namespace } from "../../config";
import { createColumnConfig } from "./config";

export const useDepositHistory = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();

  const columnConfig = createColumnConfig(t);

  const rawDataProvider = useAppSelector(selectDepositsHistoryWithExplorerUrl);
  const jltTokenAddress = useAppSelector(selectJltTokenAddress);
  const dataProvider = rawDataProvider.filter(
    ({ deposit_sources }: DepositHistoryRecordProps) =>
      deposit_sources.every((source) => source.address !== jltTokenAddress)
  );
  const pageSize = useAppSelector(selectWalletPageSize);

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
