import { EcoAssets } from "@/definitions/types";
import { createLabelValue } from "@/utils/dataGrid.helpers";

export const assetTypeNamespace = "common:ecoAssetType";

export const createSideToggleGroupValues = (t: TFunc) => [
  {
    ...createLabelValue(t, EcoAssets.Recs, assetTypeNamespace),
  },
  {
    ...createLabelValue(t, EcoAssets.CarbonCredits, assetTypeNamespace),
    disabled: true,
  },
  {
    ...createLabelValue(t, EcoAssets.Forwards, assetTypeNamespace),
    disabled: true,
  },
];
