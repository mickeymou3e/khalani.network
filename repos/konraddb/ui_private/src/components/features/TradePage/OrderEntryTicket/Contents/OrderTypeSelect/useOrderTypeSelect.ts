import { useTranslation } from "next-i18next";

import { Symbols } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin } from "@/store/auth";
import { changeOrderType } from "@/store/ui/ui.store";
import { formatValue } from "@/utils/formatters";

import { createOrderTypeValues, namespace } from "../../config";
import { OrderTypeSelectProps } from "./OrderTypeSelect";

const useOrderTypeSelect = ({
  assetDetails,
  ticketValues,
  isBuySide,
  balance: balanceBase,
}: OrderTypeSelectProps) => {
  const { t } = useTranslation([namespace]);
  const dispatch = useAppDispatch();
  const isFullyLoggedIn = useAppSelector(selectIsValidLogin);

  const selectValue = ticketValues.orderType;
  const selectLabel = t(`${namespace}:type`);
  const asset = isBuySide ? assetDetails?.quote : assetDetails?.base;
  const selectSecondaryLabel = t(`${namespace}:available`);
  const balance =
    asset && isFullyLoggedIn
      ? formatValue(balanceBase ?? 0)
      : Symbols.NoBalance;
  const selectTertiaryLabel = `${balance} ${asset ?? ""}`;

  const handleSetValue = (value: unknown) => {
    dispatch(changeOrderType(value as string));
  };

  return {
    selectOptions: createOrderTypeValues(t),
    selectValue,
    selectLabel,
    selectSecondaryLabel,
    selectTertiaryLabel,
    handleSetValue,
  };
};

export default useOrderTypeSelect;
