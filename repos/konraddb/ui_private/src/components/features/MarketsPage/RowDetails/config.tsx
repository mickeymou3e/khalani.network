import {
  Asset,
  ColumnProps,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { AmountCell } from "@/components/molecules/DataGrid";

export enum ColumnKeys {
  Generator = "generator",
  Vintage = "vintage",
  Region = "region",
  TechType = "techType",
  Registry = "registry",
  Quantity = "quantity",
}

export const namespace = "markets-page:details";

export const createColumnConfig = (t: TFunc): ColumnProps[] => [
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
    title: t(`${namespace}:${ColumnKeys.Quantity}`),
    key: ColumnKeys.Quantity,
    cellRenderer: (row: RowProps) => <AmountCell value={row.balance} strong />,
  },
];
