import {
  Asset,
  ColumnProps,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { AmountCell } from "@/components/molecules/DataGrid";

export const namespace = "pool-page:common:assetSelector";

export enum ColumnKeys {
  Generator = "generator",
  Vintage = "vintage",
  Region = "region",
  TechType = "techType",
  Registry = "registry",
  Balance = "balance",
  Total = "total",
  MaxAmount = "maxAmount",
}

export const createColumnConfig = (
  t: TFunc,
  isRedeem: boolean
): ColumnProps[] => [
  {
    title: t(`${namespace}:${ColumnKeys.Generator}`),
    key: ColumnKeys.Generator,
    sortable: true,
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
    sortable: true,
    cellRenderer: (row: RowProps) => <ValueCell value={row.vintage} />,
  },
  {
    title: t(`${namespace}:${ColumnKeys.Region}`),
    key: ColumnKeys.Region,
    sortable: true,
    cellRenderer: (row: RowProps) => <ValueCell value={row.region} />,
  },
  {
    title: t(`${namespace}:${ColumnKeys.TechType}`),
    key: ColumnKeys.TechType,
    sortable: true,
    cellRenderer: (row: RowProps) => <ValueCell value={row.techType} />,
  },
  {
    title: t(`${namespace}:${ColumnKeys.Registry}`),
    key: ColumnKeys.Registry,
    sortable: true,
    cellRenderer: (row: RowProps) => <ValueCell value={row.registry} />,
  },
  {
    title: t(
      `${namespace}:${isRedeem ? ColumnKeys.MaxAmount : ColumnKeys.Total}`
    ),
    key: ColumnKeys.Balance,
    sortable: true,
    cellRenderer: (row: RowProps) => <AmountCell value={row.balance} strong />,
  },
];
