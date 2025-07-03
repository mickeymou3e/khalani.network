import { useTranslation } from "next-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin } from "@/store/auth";
import {
  selectSearchText,
  selectSelectedHolding,
} from "@/store/ui/ui.selectors";
import { changeSearchText, changeSelectedHolding } from "@/store/ui/ui.store";
import { HoldingsActionTypes } from "@/store/ui/ui.types";

import { createHoldingToggleGroupValues, namespace } from "./config";

const useHoldings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedHolding = useAppSelector(selectSelectedHolding);
  const holdingToggleGroupValues = createHoldingToggleGroupValues(t);
  const searchText = useAppSelector(selectSearchText);
  const isAuthenticated = useAppSelector(selectIsValidLogin);
  const searchPlaceholder = t(`${namespace}:search`);
  const isOrdersSelected = selectedHolding === HoldingsActionTypes.Orders;
  const isHistorySelected = selectedHolding === HoldingsActionTypes.History;
  const isPortfolioSelected = selectedHolding === HoldingsActionTypes.Portfolio;

  const handleToggleChange = (_: unknown, value: string) => {
    if (!value) return;

    dispatch(changeSelectedHolding(value));
  };

  const handleChangeSearchText = (text: string) => {
    dispatch(changeSearchText(text));
  };

  return {
    selectedHolding,
    holdingToggleGroupValues,
    isOrdersSelected,
    isHistorySelected,
    isPortfolioSelected,
    isAuthenticated,
    searchText,
    searchPlaceholder,
    handleToggleChange,
    handleChangeSearchText,
  };
};

export default useHoldings;
