import {
  Asset,
  ColumnProps,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { createTitleKey } from "@/utils/dataGrid.helpers";

export const namespace = "pool-page:common:poolSelector";

export enum ColumnKeys {
  Currency = "currency",
  Available = "available",
  Total = "total",
}

export const createColumnConfig = (t: TFunc): ColumnProps[] => [
  {
    ...createTitleKey(t, ColumnKeys.Currency, namespace),
    sortable: true,
    width: "280px",
    cellRenderer: (row: RowProps) => {
      const asset = {
        icon: row.asset,
        label: row.assetName,
        description: row.description,
      };

      return <Asset asset={asset} showDescription />;
    },
  },
  {
    ...createTitleKey(t, ColumnKeys.Available, namespace),
    sortable: true,
    width: "128px",
    cellRenderer: (row: RowProps) => (
      <ValueCell value={row.base.availableToAux} />
    ),
  },
  {
    ...createTitleKey(t, ColumnKeys.Total, namespace),
    sortable: true,
    width: "128px",
    cellRenderer: (row: RowProps) => <ValueCell value={row.base.total} bold />,
  },
];
