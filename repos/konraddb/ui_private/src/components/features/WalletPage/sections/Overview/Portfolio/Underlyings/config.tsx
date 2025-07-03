import { Button } from "@mui/material";

import {
  Asset,
  ColumnProps,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { AmountCell, CellClickFunc } from "@/components/molecules/DataGrid";

import { namespace } from "../../config";

export enum ColumnKeys {
  Generator = "generator",
  Vintage = "vintage",
  Region = "region",
  TechType = "techType",
  Registry = "registry",
  Total = "total",
  Action = "action",
}

export const createColumnConfig = (t: TFunc): ColumnProps[] => [
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
    title: t(`${namespace}:${ColumnKeys.Total}`),
    key: ColumnKeys.Total,
    sortable: true,
    cellRenderer: (row: RowProps) => <AmountCell value={row.balance} strong />,
  },
  {
    title: t(`${namespace}:${ColumnKeys.Action}`),
    key: ColumnKeys.Action,
    width: "108px",
    cellRenderer: (
      row: RowProps,
      column: ColumnProps,
      onClick: CellClickFunc
    ) => (
      <Button
        variant="outlined"
        size="small"
        onClick={() => onClick(row, column)}
        disabled={!row.eligibleForPooling}
      >
        {t(`${namespace}:pool`)}
      </Button>
    ),
  },
];
