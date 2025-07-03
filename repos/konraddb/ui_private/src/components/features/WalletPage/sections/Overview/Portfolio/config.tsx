import { WalletPorfolioTabs } from "@/definitions/types";

import { namespace } from "../config";

export enum PortfolioColumnKeys {
  Currency = "currency",
  Settled = "settled",
  InSettlement = "inSettlement",
  InOrders = "inOrders",
  Balance = "balance",
  Action = "action",
}

export const createTitleKey = (t: TFunc, key: string) => ({
  title: t(`${namespace}:${key}`),
  key,
});

export const createLabelValue = (t: TFunc, key: string) => ({
  label: t(`${namespace}:${key}`),
  value: key,
});

export const createPortfolioToggleGroupValues = (t: TFunc) => [
  createLabelValue(t, WalletPorfolioTabs.pool),
  createLabelValue(t, WalletPorfolioTabs.underlyings),
  createLabelValue(t, WalletPorfolioTabs.fiat),
];
