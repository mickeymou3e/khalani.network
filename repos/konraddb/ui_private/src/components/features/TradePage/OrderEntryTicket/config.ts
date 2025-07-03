import { ExecutionSide, OrderType } from "@/definitions/types";

export const sideNamespace = "common:executionSide";
export const orderTypeNamespace = "common:orderTypes";
export const namespace = "trade-page:orderTicket";

const createLabelValue = (t: TFunc, namespace: string, key: string) => ({
  label: t(`${namespace}:${key}`),
  value: key,
});

export const createSideToggleGroupValues = (t: TFunc) => [
  createLabelValue(t, sideNamespace, ExecutionSide.BUY),
  createLabelValue(t, sideNamespace, ExecutionSide.SELL),
];

export const createOrderTypeValues = (t: TFunc) => [
  createLabelValue(t, orderTypeNamespace, OrderType.MARKET),
  createLabelValue(t, orderTypeNamespace, OrderType.LIMIT),
];
