import { useTranslation } from "next-i18next";

import { Symbols } from "@/definitions/types";
import { useAppSelector } from "@/store";
import { PoolModes } from "@/store/pool";
import { formatValue } from "@/utils/formatters";

import {
  selectAssetSelections,
  selectPoolSelections,
} from "../../store/pool.selectors";

export const useDestinationAssets = (namespace: string, type: string) => {
  const { t } = useTranslation(namespace);
  const assetSelections = useAppSelector(selectAssetSelections);
  const poolSelections = useAppSelector(selectPoolSelections);
  const isDepositAction = type === PoolModes.Deposit;
  const selectionList = isDepositAction ? poolSelections : assetSelections;
  const assetsExist = selectionList.length > 0;
  const resultText = t(`${namespace}:summary:resultText`);
  const assetLabel = t(`${namespace}:asset`);
  const feeLabel = t(`${namespace}:fee`);
  const assetValues = selectionList.reduce(
    (acc, { amountValue }) => acc + amountValue,
    0
  );
  const feeValues = formatValue(
    assetValues * Number(process.env.NEXT_PUBLIC_TRADING_FEE_MULTIPLIER)
  );
  const feeValue = assetsExist ? feeValues : Symbols.NoValue;

  return {
    selectionList,
    assetsExist,
    resultText,
    assetLabel,
    feeLabel,
    feeValue,
  };
};
