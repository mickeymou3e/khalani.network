import { Button, TransactionStatusDisplay } from "@/components/atoms";
import {
  CellClickFunc,
  ColumnProps,
  ExecutionSideCell,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { OrderStatus } from "@/definitions/types";
import { getUserRoleIconPath } from "@/utils/general";

import { createTitleKey, namespace } from "../config";

export enum OrdersColumnKeys {
  User = "user",
  Date = "date",
  Pair = "pair",
  Side = "side",
  Type = "type",
  Amount = "amount",
  Price = "price",
  Total = "total",
  Status = "status",
  Action = "action",
}

export const createOrdersColumns = (isAdmin: boolean, t: TFunc) => {
  const userColumn = isAdmin
    ? {
        ...createTitleKey(t, OrdersColumnKeys.User),
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
      ...createTitleKey(t, OrdersColumnKeys.Date),
      cellRenderer: (row: RowProps) => (
        <ValueCell value={row.date} secondaryValue={row.time} small />
      ),
    },
    createTitleKey(t, OrdersColumnKeys.Pair),
    {
      ...createTitleKey(t, OrdersColumnKeys.Side),
      cellRenderer: (row: RowProps) => (
        <ExecutionSideCell side={t(`common:executionSide:${row.side}`)} small />
      ),
    },
    {
      ...createTitleKey(t, OrdersColumnKeys.Type),
      cellRenderer: (row: RowProps) => (
        <ValueCell value={t(`common:orderTypes:${row.type}`)} small />
      ),
    },
    createTitleKey(t, OrdersColumnKeys.Amount),
    createTitleKey(t, OrdersColumnKeys.Price),
    createTitleKey(t, OrdersColumnKeys.Total),
    {
      ...createTitleKey(t, OrdersColumnKeys.Status),
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
            percent={row.filledPercentageValue}
            label={statusLabel}
            small
          />
        );
      },
    },
    {
      ...createTitleKey(t, OrdersColumnKeys.Action),
      width: "1px",
      cellRenderer: (
        row: RowProps,
        column: ColumnProps,
        onClick: CellClickFunc
      ) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => onClick(row, column)}
          disabled={row.status === OrderStatus.TOCANCEL}
        >
          {t(`${namespace}:cancel`)}
        </Button>
      ),
    },
  ];
};
