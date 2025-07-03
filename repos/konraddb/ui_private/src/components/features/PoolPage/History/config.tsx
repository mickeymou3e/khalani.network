import { TransactionStatusDisplay } from "@/components/atoms";
import { RowProps, ValueCell } from "@/components/molecules";

export const namespace = "pool-page:history";

export enum HistoryColumnKeys {
  Date = "date",
  CreditPooled = "creditPooled",
  RedeemedFrom = "redeemedFrom",
  AmountPooled = "amountPooled",
  AmountRedeemed = "amountRedeemed",
  PooledInto = "pooledInto",
  RedeemedInto = "redeemedInto",
  AmountReceived = "amountReceived",
  Fee = "fee",
  Status = "status",
}

export const createTitleKey = (t: TFunc, key: string) => ({
  title: t(`${namespace}:${key}`),
  key,
});

export const createColumnConfig = (isDeposit: boolean, t: TFunc) => [
  {
    ...createTitleKey(t, HistoryColumnKeys.Date),
    cellRenderer: (row: RowProps) => (
      <ValueCell value={row.date} secondaryValue={row.time} small />
    ),
  },
  createTitleKey(
    t,
    isDeposit ? HistoryColumnKeys.CreditPooled : HistoryColumnKeys.RedeemedFrom
  ),
  createTitleKey(
    t,
    isDeposit
      ? HistoryColumnKeys.AmountPooled
      : HistoryColumnKeys.AmountRedeemed
  ),
  createTitleKey(
    t,
    isDeposit ? HistoryColumnKeys.PooledInto : HistoryColumnKeys.RedeemedInto
  ),
  createTitleKey(t, HistoryColumnKeys.AmountReceived),
  createTitleKey(t, HistoryColumnKeys.Fee),
  {
    ...createTitleKey(t, HistoryColumnKeys.Status),
    cellRenderer: (row: RowProps) => (
      <TransactionStatusDisplay status={row.status} label={row.status} small />
    ),
  },
];
