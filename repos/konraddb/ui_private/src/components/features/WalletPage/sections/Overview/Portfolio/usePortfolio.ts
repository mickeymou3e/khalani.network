import { useState } from "react";
import { useTranslation } from "next-i18next";

import { WalletPorfolioTabs } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsEnergyAttributeTokensEmpty } from "@/store/ancillary";
import {
  selectIsCryptoBalancesEmpty,
  selectIsFiatBalancesEmpty,
} from "@/store/balances";
import { setActivePortfolioTab } from "@/store/ui";
import { selectActivePortfolioTab } from "@/store/ui/ui.selectors";
import { evaluate } from "@/utils/logic";

import { namespace } from "../config";
import { createPortfolioToggleGroupValues } from "./config";

export const usePortfolio = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(namespace);
  const [searchKeyword, setSearchKeyword] = useState("");
  const selectedPortfolioTab = useAppSelector(selectActivePortfolioTab);
  const portfolioToggleGroupValues = createPortfolioToggleGroupValues(t);
  const cryptoListEmpty = useAppSelector(selectIsCryptoBalancesEmpty);
  const fiatListEmpty = useAppSelector(selectIsFiatBalancesEmpty);
  const underlyingsListEmpty = useAppSelector(
    selectIsEnergyAttributeTokensEmpty
  );
  const isListEmpty = evaluate<boolean>(
    [selectedPortfolioTab === WalletPorfolioTabs.pool, cryptoListEmpty],
    [selectedPortfolioTab === WalletPorfolioTabs.fiat, fiatListEmpty],
    [
      selectedPortfolioTab === WalletPorfolioTabs.underlyings,
      underlyingsListEmpty,
    ]
  );

  const search = t(`${namespace}:search`);

  const handleToggleChange = (_: unknown, value: string) => {
    if (!value) return;

    dispatch(setActivePortfolioTab(value));
  };

  return {
    portfolioToggleGroupValues,
    search,
    selectedPortfolioTab,
    searchKeyword,
    isListEmpty,
    handleToggleChange,
    setSearchKeyword,
  };
};
