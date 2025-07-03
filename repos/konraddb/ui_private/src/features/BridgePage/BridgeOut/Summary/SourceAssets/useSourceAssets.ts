import { useTranslation } from "next-i18next";

import {
  resetSelection,
  selectAssetSelections,
  selectionAssetRemoved,
  selectIsSelectionListPopulated,
} from "@/features/BridgePage/store";
import { useAppDispatch, useAppSelector } from "@/store";

import { namespace } from "../useSummary";

export const useSourceAssets = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isSelectionPopulated = useAppSelector(selectIsSelectionListPopulated);
  const selectionList = useAppSelector(selectAssetSelections);

  const sectionText = t(`${namespace}:youBridgeOut`);
  const clearBridgeListText = t(`${namespace}:clearList`);
  const placeholderText = t(`${namespace}:placeholderText`);

  const handleDeleteClick = (id: string) => {
    dispatch(selectionAssetRemoved(id));
  };

  const handleClearList = () => {
    dispatch(resetSelection());
  };

  return {
    selectionList,
    isSelectionPopulated,
    sectionText,
    clearBridgeListText,
    placeholderText,
    handleDeleteClick,
    handleClearList,
  };
};
