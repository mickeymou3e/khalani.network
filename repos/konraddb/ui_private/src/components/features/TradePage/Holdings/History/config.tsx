import { Button, TransactionStatusDisplay } from "@/components/atoms";
import {
  CellClickFunc,
  ColumnProps,
  ExecutionSideCell,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { getUserRoleIconPath } from "@/utils/general";

import { createTitleKey, namespace } from "../config";

export enum HistoryColumnKeys {
  User = "user",
  Date = "date",
  Pair = "pair",
  Side = "side",
  Type = "type",
  Amount = "amount",
  Price = "price",
  Fee = "fee",
  Total = "total",
  Status = "status",
  Action = "action",
}

export const createHistoryColumns = (isAdmin: boolean, t: TFunc) => {
  const userColumn = isAdmin
    ? {
        ...createTitleKey(t, HistoryColumnKeys.User),
        cellRenderer: (row: RowProps) => {
          if (!row.user) return null;

          const iconPath = getUserRoleIconPath(row.role);
          const role = t(`${namespace}:${row.role}`);

          return (
            <ValueCell
              value={row.user}
              secondaryValue={role}
              icon={iconPath}
              small
            />
          );
        },
      }
    : null;

  return [
    ...(userColumn ? [userColumn] : []),
    {
      ...createTitleKey(t, HistoryColumnKeys.Date),
      cellRenderer: (row: RowProps) => (
        <ValueCell value={row.date} secondaryValue={row.time} small />
      ),
    },
    createTitleKey(t, HistoryColumnKeys.Pair),
    {
      ...createTitleKey(t, HistoryColumnKeys.Side),
      cellRenderer: (row: RowProps) => (
        <ExecutionSideCell side={t(`common:executionSide:${row.side}`)} small />
      ),
    },
    {
      ...createTitleKey(t, HistoryColumnKeys.Type),
      cellRenderer: (row: RowProps) => (
        <ValueCell value={t(`common:orderTypes:${row.type}`)} small />
      ),
    },
    createTitleKey(t, HistoryColumnKeys.Amount),
    createTitleKey(t, HistoryColumnKeys.Price),
    createTitleKey(t, HistoryColumnKeys.Fee),
    createTitleKey(t, HistoryColumnKeys.Total),
    {
      ...createTitleKey(t, HistoryColumnKeys.Status),
      cellRenderer: (row: RowProps) => {
        const statusLabel = row.isPartial
          ? t(`common:orderStatuses:partiallyFilled`, {
              partial: row.filledPercentage,
            })
          : t(`common:orderStatuses:${row.status}`);

        return (
          <TransactionStatusDisplay
            status={row.status}
            partial={row.isPartial}
            label={statusLabel}
            small
          />
        );
      },
    },
    {
      ...createTitleKey(t, HistoryColumnKeys.Action),
      cellRenderer: (
        row: RowProps,
        column: ColumnProps,
        onClick: CellClickFunc
      ) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => onClick(row, column)}
        >
          {t(`${namespace}:details`)}
        </Button>
      ),
    },
  ];
};
