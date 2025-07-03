import { createSelector } from "@reduxjs/toolkit";

import { TradedPair, tradedPairs } from "@/definitions/config";
import { AssignedAsset } from "@/services/assets";
import { selectAssignedAssets } from "@/services/assets/assets.api";
import { selectSelectedPair } from "@/store/ui/ui.selectors";

export const selectSelectedAsset = createSelector(
  [selectSelectedPair, selectAssignedAssets],
  (selectedPair, assignedAssets = []) => {
    const findFn = (asset: AssignedAsset | TradedPair) =>
      asset.pair! === selectedPair.pair;
    return assignedAssets.length
      ? assignedAssets.find(findFn)
      : tradedPairs.find(findFn);
  }
);

export const selectFirstAsset = createSelector(
  selectAssignedAssets,
  (assignedAssets = []) => assignedAssets[0]
);

export const selectGuaranteedSelectedAssetAmount = createSelector(
  [selectSelectedAsset, selectAssignedAssets],
  (selectedAsset, assignedAssets = []) => {
    const asset = assignedAssets.find(
      ({ base }) => base === selectedAsset?.base
    );
    return asset ? Number(asset?.guaranteed_qty) : 0;
  }
);
