import { CertificateRegistry, Registries } from "@/definitions/config";

import { AssetTypes } from "../../store";

export const createAssetTypes = () =>
  AssetTypes.map((asset) => ({
    value: asset.id,
    assets: [
      {
        icon: asset.id,
        label: asset.name,
        description: asset.description,
      },
    ],
  }));

export const createRegistryAssets = () =>
  Registries.filter(({ name }) =>
    [
      CertificateRegistry.NAR,
      CertificateRegistry.ERCOT,
      CertificateRegistry.M_RETS,
    ].includes(name)
  ).map((registry) => ({
    value: registry.name,
    assets: [
      {
        icon: registry.icon,
        label: registry.name,
        description: registry.description,
      },
    ],
  }));
