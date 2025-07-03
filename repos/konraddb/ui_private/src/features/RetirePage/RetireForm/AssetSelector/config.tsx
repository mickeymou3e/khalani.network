import {
  Asset,
  ColumnProps,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { AmountCell } from "@/components/molecules/DataGrid";

import { namespace } from "../config";

export enum ColumnKeys {
  Generator = "generator",
  Vintage = "vintage",
  Region = "region",
  TechType = "techType",
  Registry = "registry",
  Balance = "strategyBalance",
  Total = "total",
}

export enum PoolTokensColumnKeys {
  Asset = "asset",
  Available = "available",
  Total = "total",
}

export const createAssetsColumnConfig = (t: TFunc): ColumnProps[] => [
  {
    title: t(`${namespace}:${ColumnKeys.Generator}`),
    key: ColumnKeys.Generator,
    cellRenderer: (row: RowProps) => {
      const asset = {
        icon: row.icon,
        label: row.generator,
      };

      return <Asset asset={asset} showDescription />;
    },
  },
  {
    title: t(`${namespace}:${ColumnKeys.Vintage}`),
    key: ColumnKeys.Vintage,
    cellRenderer: (row: RowProps) => <ValueCell value={row.vintage} />,
  },
  {
    title: t(`${namespace}:${ColumnKeys.Region}`),
    key: ColumnKeys.Region,
    cellRenderer: (row: RowProps) => <ValueCell value={row.region} />,
  },
  {
    title: t(`${namespace}:${ColumnKeys.TechType}`),
    key: ColumnKeys.TechType,
    cellRenderer: (row: RowProps) => <ValueCell value={row.techType} />,
  },
  {
    title: t(`${namespace}:${ColumnKeys.Registry}`),
    key: ColumnKeys.Registry,
    cellRenderer: (row: RowProps) => <ValueCell value={row.registry} />,
  },
  {
    title: t(`${namespace}:${ColumnKeys.Total}`),
    key: ColumnKeys.Balance,
    width: "1px",
    cellRenderer: (row: RowProps) => (
      <AmountCell value={row.strategyBalance} strong />
    ),
  },
];

export const createPoolTokensColumnConfig = (t: TFunc): ColumnProps[] => [
  {
    title: t(`${namespace}:${PoolTokensColumnKeys.Asset}`),
    key: PoolTokensColumnKeys.Asset,
    cellRenderer: (row: RowProps) => {
      const asset = {
        icon: row.icon,
        label: row.asset,
        description: row.description,
      };

      return <Asset asset={asset} showDescription />;
    },
  },
  {
    title: t(`${namespace}:${PoolTokensColumnKeys.Available}`),
    key: PoolTokensColumnKeys.Available,
    width: "1px",
    cellRenderer: (row: RowProps) => <AmountCell value={row.balance} />,
  },
  {
    title: t(`${namespace}:${PoolTokensColumnKeys.Total}`),
    key: PoolTokensColumnKeys.Total,
    width: "1px",
    cellRenderer: (row: RowProps) => <AmountCell value={row.total} strong />,
  },
];
