import { useTranslation } from "next-i18next";

import { useAppSelector } from "@/store";
import {
  selectJasmineTechTypeOrder,
  selectJasmineTechTypes,
  selectJasmineVintages,
} from "@/store/pool";
import { formatShortValue } from "@/utils/formatters";

import { namespace } from "../config";

export const useStatsPopover = () => {
  const { t } = useTranslation(namespace);
  const techTypes = useAppSelector(selectJasmineTechTypes);
  const techTypeOrder = useAppSelector(selectJasmineTechTypeOrder);
  const vintages = useAppSelector(selectJasmineVintages);

  const title = t(`${namespace}:poolSelector:underlyingAssets`);
  const techTypeLabel = t(`${namespace}:poolSelector:techType`);
  const vintageLabel = t(`${namespace}:poolSelector:vintage`);

  const formatValue = (value: number) => `(${formatShortValue(value, 0)})`;

  return {
    techTypes,
    techTypeOrder,
    vintages,
    title,
    techTypeLabel,
    vintageLabel,
    formatValue,
  };
};
