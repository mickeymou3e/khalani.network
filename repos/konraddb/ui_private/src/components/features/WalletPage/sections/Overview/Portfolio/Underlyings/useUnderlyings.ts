import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { RowProps } from "@/components/molecules";
import { AppRoutes } from "@/definitions/config";
import { useAppDispatch, useAppSelector } from "@/store";
import { seelctSortedEnergyAttributeTokens } from "@/store/ancillary";
import { selectCryptoBalanceAssets } from "@/store/balances";
import { openPoolPage } from "@/store/pool";
import {
  changeWalletPageSize,
  selectHideZeroBalances,
  selectWalletPageSize,
} from "@/store/ui";
import { filterOptions } from "@/utils/filter.helpers";

import { namespace } from "../../config";
import { createColumnConfig } from "./config";

export const useUnderlyings = (searchKeyword: string) => {
  const { t } = useTranslation(namespace);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hideZeroBalances = useAppSelector(selectHideZeroBalances);
  const columnConfig = createColumnConfig(t);
  const listLength = useAppSelector(selectWalletPageSize);
  const [jltAssetOption] = useAppSelector(selectCryptoBalanceAssets);
  const strategyAssets = useAppSelector(seelctSortedEnergyAttributeTokens);
  const dataProvider = filterOptions(strategyAssets ?? [], searchKeyword);

  const noDataText = t(`${namespace}:noPortfolio`);
  const zeroBalanceHidden = t(`${namespace}:zeroBalanceHidden`);

  const handleCellClick = (row: RowProps) => {
    const payload = {
      assetKey: row.id,
      poolKey: jltAssetOption?.value,
    };
    dispatch(openPoolPage(payload));
    router.push(AppRoutes.POOL);
  };

  const handlePageSizeChange = (pageSize: unknown) => {
    dispatch(changeWalletPageSize(pageSize as number));
  };

  return {
    columnConfig,
    dataProvider,
    listLength,
    hideZeroBalances,
    noDataText,
    zeroBalanceHidden,
    handleCellClick,
    handlePageSizeChange,
  };
};
