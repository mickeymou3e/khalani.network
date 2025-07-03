import { useTranslation } from "next-i18next";

import { ModalVariants } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { openModal } from "@/store/ui";

import {
  resetSelection,
  selectAssetSelections,
  selectionAssetRemoved,
} from "../store";

export const namespace = "retire-page:selectedAssets";

export const useSelectedAssets = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const selectionList = useAppSelector(selectAssetSelections);
  const assetsExist = Boolean(selectionList.length);
  const titleText = t(`${namespace}:title`);
  const sectionText = t(`${namespace}:youRetire`);
  const clearRetireListText = t(`${namespace}:clearList`);
  const placeholderText = t(`${namespace}:placeholderText`);
  const actionText = t(`${namespace}:retire`);
  const summaryDescriptionBold = t(`${namespace}:summaryDescriptionBold`);
  const summaryDescription = t(`${namespace}:summaryDescription`);

  const handleDeleteClick = (id: string) => {
    dispatch(selectionAssetRemoved(id));
  };

  const handleClearList = () => {
    dispatch(resetSelection());
  };

  const handleRetireClick = () => {
    dispatch(openModal(ModalVariants.Retire));
  };

  return {
    selectionList,
    assetsExist,
    titleText,
    sectionText,
    clearRetireListText,
    placeholderText,
    actionText,
    summaryDescriptionBold,
    summaryDescription,
    handleDeleteClick,
    handleClearList,
    handleRetireClick,
  };
};
