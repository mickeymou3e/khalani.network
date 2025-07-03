import { TransactionStatusDisplay } from "@/components/atoms";
import { RowProps, ValueCell } from "@/components/molecules";

export const namespace = "retire-page:history";

export enum HistoryColumnKeys {
  Date = "date",
  CreditRetired = "creditRetired",
  Registry = "registry",
  Amount = "amount",
  Status = "status",
}

export const createTitleKey = (t: TFunc, key: string) => ({
  title: t(`${namespace}:${key}`),
  key,
});

export const createColumnConfig = (t: TFunc) => [
  {
    ...createTitleKey(t, HistoryColumnKeys.Date),
    cellRenderer: (row: RowProps) => (
      <ValueCell value={row.date} secondaryValue={row.time} small />
    ),
  },
  createTitleKey(t, HistoryColumnKeys.CreditRetired),
  createTitleKey(t, HistoryColumnKeys.Registry),
  createTitleKey(t, HistoryColumnKeys.Amount),
  {
    ...createTitleKey(t, HistoryColumnKeys.Status),
    cellRenderer: (row: RowProps) => (
      <TransactionStatusDisplay status={row.status} label={row.status} small />
    ),
  },
];
