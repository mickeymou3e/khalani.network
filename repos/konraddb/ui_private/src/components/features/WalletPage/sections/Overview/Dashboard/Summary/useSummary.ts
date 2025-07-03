import { useTranslation } from "next-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser } from "@/store/account";
import { selectPortfolioTotal } from "@/store/balances/balances.selectors";
import { selectHidePortfolioValues } from "@/store/ui/ui.selectors";
import { changeHidePortfolioValues } from "@/store/ui/ui.store";
import { formatEurValue, hideNumericValues } from "@/utils/formatters";

import { namespace } from "../../config";

export const useSummary = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const withdrawalLimit: any = [];
  const hideValues = useAppSelector(selectHidePortfolioValues);
  const portfolio = useAppSelector(selectPortfolioTotal);
  const isAdmin = useAppSelector(selectIsAdminUser);

  const portfolioTotalValue = formatEurValue(portfolio);
  const portfolioTotalValueEur = formatEurValue(portfolio);
  const limit = formatEurValue(
    withdrawalLimit?.length ? withdrawalLimit[0].limit : portfolio
  );
  const withdrawalDisabled = portfolio === 0;

  const handleHidePortfolioValues = () => {
    dispatch(changeHidePortfolioValues(!hideValues));
  };

  return {
    portfolioText: t(`${namespace}:yourPortfolio`),
    depositText: t(`${namespace}:deposit`),
    withdrawText: t(`${namespace}:withdraw`),
    dailyLimitText: t(`${namespace}:dailyLimit`, {
      limit: hideValues ? hideNumericValues(limit) : limit,
    }),
    portfolioTotalValueNumber: hideValues
      ? hideNumericValues(portfolio.toString())
      : portfolio,
    portfolioTotalValue: hideValues
      ? hideNumericValues(portfolioTotalValue)
      : portfolioTotalValue,
    portfolioTotalValueEur: hideValues
      ? hideNumericValues(portfolioTotalValueEur)
      : portfolioTotalValueEur,
    hideValues,
    withdrawalDisabled,
    isAdmin,
    handleHidePortfolioValues,
  };
};
