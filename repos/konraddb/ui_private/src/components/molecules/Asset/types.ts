import { BaseAssetEntry, BaseAssetProps } from "./BaseAsset";

export interface AssetProps extends Omit<BaseAssetProps, "assets"> {
  assets?: BaseAssetEntry[];
  asset?: BaseAssetEntry;
}
