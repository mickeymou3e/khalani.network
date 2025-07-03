import { useTranslation } from "next-i18next";

import { getRegistry } from "@/definitions/config/registry";
import {
  selectAssetSelections,
  selectIsSelectionListPopulated,
} from "@/features/BridgePage/store";
import { useAppSelector } from "@/store";
import { decodeEnergyAttributeTokenId } from "@/store/ancillary";

import { namespace } from "../useSummary";

export const useDestinationAssets = () => {
  const { t } = useTranslation(namespace);
  const isSelectionPopulated = useAppSelector(selectIsSelectionListPopulated);
  const rawSelectionList = useAppSelector(selectAssetSelections);
  const selectionList = rawSelectionList.map((selection) => {
    const { registry } = decodeEnergyAttributeTokenId(selection.id);
    const icon = getRegistry(registry)?.icon ?? "";

    return { ...selection, icon };
  });

  const sectionText = t(`${namespace}:youReceive`);
  const creditToRegistry = t(`${namespace}:creditSentToRegistry`);

  return {
    selectionList,
    isSelectionPopulated,
    sectionText,
    creditToRegistry,
  };
};
