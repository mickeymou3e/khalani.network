import { StaticRoutes } from "@/types/routes";
import { BaseAsset, BaseAssetEntry } from "./BaseAsset";
import { AssetProps } from "./types";

export const Asset = ({ asset, assets, ...props }: AssetProps) => {
  if (!assets && !asset) {
    return null;
  }

  const updatedAssets = (assets || [asset]).map((asset?: BaseAssetEntry) => {
    const iconName = asset?.icon?.toLowerCase() ?? asset?.label?.toLowerCase();
    return {
      icon: `${StaticRoutes.ASSET_ICONS}/${iconName}.svg`,
      label: asset?.label ?? asset?.name ?? "Unknown",
      description: asset?.description ?? "",
    };
  });

  return <BaseAsset assets={updatedAssets} small {...props} />;
};
