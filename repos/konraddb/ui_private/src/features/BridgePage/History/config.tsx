import { Button, TransactionStatusDisplay } from "@/components/atoms";
import {
  Asset,
  CellClickFunc,
  ColumnProps,
  RowProps,
  ValueCell,
} from "@/components/molecules";
import { BridgeMode } from "@/features/BridgePage/BridgePage.types";
import { GridTabs } from "@/features/BridgePage/store";

export const namespace = "bridge-page:history";

export const createTabs = (t: TFunc) => [
  {
    value: GridTabs.OpenRequests,
    label: t(`${namespace}:${GridTabs.OpenRequests}`),
  },
  {
    value: GridTabs.History,
    label: t(`${namespace}:${GridTabs.History}`),
  },
];

export enum OpenRequestColumnKeys {
  Credit = "credit",
  Type = "type",
  Registry = "registry",
  Amount = "amount",
  Status = "status",
  Action = "action",
}

export enum HistoryColumnKeys {
  Date = "date",
  Type = "type",
  Registry = "registry",
  CreditBridged = "creditBridged",
  Amount = "amount",
  Status = "status",
}

export const createTitleKey = (t: TFunc, key: string) => ({
  title: t(`${namespace}:${key}`),
  key,
});

export const createOpenRequestColumnConfig = (
  t: TFunc,
  disableActions: boolean
) => [
  {
    ...createTitleKey(t, OpenRequestColumnKeys.Credit),
    cellRenderer: (row: RowProps) => {
      if (!row.icon) return null;

      const asset = {
        icon: row.icon,
        label: row.credit,
      };

      return <Asset asset={asset} small />;
    },
  },
  {
    ...createTitleKey(t, OpenRequestColumnKeys.Type),
    cellRenderer: (row: RowProps) => (
      <ValueCell value={t(`${namespace}:${row.type}`)} small />
    ),
  },
  createTitleKey(t, OpenRequestColumnKeys.Registry),
  createTitleKey(t, OpenRequestColumnKeys.Amount),
  {
    ...createTitleKey(t, OpenRequestColumnKeys.Status),
    cellRenderer: (row: RowProps) => (
      <TransactionStatusDisplay
        status={row.status}
        label={t(`${namespace}:${row.status}`)}
        small
      />
    ),
  },
  {
    ...createTitleKey(t, OpenRequestColumnKeys.Action),
    cellRenderer: (
      row: RowProps,
      column: ColumnProps,
      onClick: CellClickFunc
    ) => {
      if (row.type === BridgeMode.Out) return null;

      return (
        <Button
          variant="outlined"
          size="small"
          onClick={() => onClick(row, column)}
          disabled={disableActions}
        >
          {t(`${namespace}:${row.type}`)}
        </Button>
      );
    },
  },
];

export const createHistoryColumnConfig = (t: TFunc) => [
  {
    ...createTitleKey(t, HistoryColumnKeys.Date),
    cellRenderer: (row: RowProps) => (
      <ValueCell value={row.date} secondaryValue={row.time} small />
    ),
  },
  {
    ...createTitleKey(t, HistoryColumnKeys.Type),
    cellRenderer: (row: RowProps) => (
      <ValueCell value={t(`${namespace}:${row.type}`)} small />
    ),
  },
  createTitleKey(t, HistoryColumnKeys.Registry),
  createTitleKey(t, HistoryColumnKeys.CreditBridged),
  createTitleKey(t, HistoryColumnKeys.Amount),
  {
    ...createTitleKey(t, HistoryColumnKeys.Status),
    cellRenderer: (row: RowProps) => (
      <TransactionStatusDisplay
        status={row.status}
        label={t(`${namespace}:${row.status}`)}
        small
      />
    ),
  },
];
