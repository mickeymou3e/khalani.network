import { HoldingsActionTypes } from "@/store/ui/ui.types";

export const namespace = "trade-page:holdings";

export const createLabelValue = (t: TFunc, key: string) => ({
  label: t(`${namespace}:${key}`),
  value: key,
});

export const createTitleKey = (t: TFunc, key: string) => ({
  title: t(`${namespace}:${key}`),
  key,
});

export const createHoldingToggleGroupValues = (t: TFunc) => [
  createLabelValue(t, HoldingsActionTypes.Orders),
  createLabelValue(t, HoldingsActionTypes.History),
  createLabelValue(t, HoldingsActionTypes.Portfolio),
];
