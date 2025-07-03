import { useState } from "react";
import { useTranslation } from "next-i18next";

import { useAppSelector } from "@/store";
import { selectPortfolioChartValues } from "@/store/balances/balances.selectors";
import { selectHidePortfolioValues } from "@/store/ui/ui.selectors";

const namespace = "common";

export const usePieChart = () => {
  const { t } = useTranslation(namespace);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const dataProvider = useAppSelector(selectPortfolioChartValues);
  const hideValues = useAppSelector(selectHidePortfolioValues);

  const handleMouseEnter = (index: number) => {
    if (!dataProvider.length) return;

    setHighlighted(index);
  };

  const handleMouseLeave = () => {
    setHighlighted(null);
  };

  return {
    highlighted,
    dataProvider,
    hideValues,
    noBalanceYetLabel: t(`${namespace}:noBalanceYet`),
    handleMouseEnter,
    handleMouseLeave,
  };
};
