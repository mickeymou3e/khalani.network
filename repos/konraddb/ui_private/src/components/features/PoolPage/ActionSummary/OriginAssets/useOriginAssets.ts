import { useTranslation } from "next-i18next";

import { useAppDispatch, useAppSelector } from "@/store";
import { PoolModes, resetSelection, selectionAssetRemoved } from "@/store/pool";

import {
  selectAssetSelections,
  selectPoolSelections,
} from "../../store/pool.selectors";
import { OriginAssetsProps } from "./OriginAssets";

export const useOriginAssets = ({
  type,
  namespace,
}: Partial<OriginAssetsProps>) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const assetSelections = useAppSelector(selectAssetSelections);
  const poolSelections = useAppSelector(selectPoolSelections);
  const isDepositAction = type === PoolModes.Deposit;
  const selectionList = isDepositAction ? assetSelections : poolSelections;
  const assetsExist = selectionList.length > 0;
  const titleText = t(`${namespace}:summary:title`);
  const clearPoolText = t(`${namespace}:summary:clearList`);
  const placeholderText = t(`${namespace}:summary:placeholderText`);

  const handleDeleteClick = (id: string) => {
    dispatch(selectionAssetRemoved(id));
  };

  const handleClearList = () => {
    dispatch(resetSelection());
  };

  return {
    selectionList,
    assetsExist,
    isDepositAction,
    titleText,
    clearPoolText,
    placeholderText,
    handleDeleteClick,
    handleClearList,
  };
};
