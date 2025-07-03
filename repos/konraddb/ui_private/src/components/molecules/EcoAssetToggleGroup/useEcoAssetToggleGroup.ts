import { useTranslation } from "next-i18next";

import { EcoAssets } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectEcoAssetType, setEcoAssetType } from "@/store/ui";

import { assetTypeNamespace, createSideToggleGroupValues } from "./config";

export const useEcoAssetToggleGroup = () => {
  const { t } = useTranslation(assetTypeNamespace);
  const dispatch = useAppDispatch();
  const sides = createSideToggleGroupValues(t);

  const selectedSide = useAppSelector(selectEcoAssetType);

  const setSide = (value: EcoAssets) => {
    dispatch(setEcoAssetType(value));
  };

  return {
    selectedSide,
    sides,
    setSide,
  };
};
