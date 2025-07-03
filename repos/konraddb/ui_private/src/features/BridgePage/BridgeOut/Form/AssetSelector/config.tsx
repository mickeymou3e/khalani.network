import {
  Asset,
  ColumnProps,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { AmountCell } from "@/components/molecules/DataGrid";
import { createTitleKey } from "@/utils/dataGrid.helpers";

import { namespace } from "../../config";

export enum ColumnKeys {
  Generator = "generator",
  Vintage = "vintage",
  Region = "region",
  TechType = "techType",
  Registry = "registry",
  Balance = "strategyBalance",
  Total = "total",
}

export const createAssetsColumnConfig = (t: TFunc): ColumnProps[] => [
  {
    ...createTitleKey(t, ColumnKeys.Generator, namespace),
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
    ...createTitleKey(t, ColumnKeys.Vintage, namespace),
    sortable: true,
    cellRenderer: (row: RowProps) => <ValueCell value={row.vintage} />,
  },
  {
    ...createTitleKey(t, ColumnKeys.Region, namespace),
    sortable: true,
    cellRenderer: (row: RowProps) => <ValueCell value={row.region} />,
  },
  {
    ...createTitleKey(t, ColumnKeys.TechType, namespace),
    sortable: true,
    cellRenderer: (row: RowProps) => <ValueCell value={row.techType} />,
  },
  {
    ...createTitleKey(t, ColumnKeys.Registry, namespace),
    sortable: true,
    cellRenderer: (row: RowProps) => <ValueCell value={row.registry} />,
  },
  {
    title: t(`${namespace}:${ColumnKeys.Total}`),
    key: ColumnKeys.Balance,
    width: "1px",
    sortable: true,
    cellRenderer: (row: RowProps) => (
      <AmountCell value={row.strategyBalance} strong />
    ),
  },
];
