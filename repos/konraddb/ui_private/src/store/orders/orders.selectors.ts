import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import * as dateFns from "date-fns";

import { getAssetDetails } from "@/definitions/config";
import {
  ExecutionSide,
  OrderStatus,
  OrderType,
  SettledOrderStatuses,
  Symbols,
} from "@/definitions/types";
import { selectUserProfile } from "@/services/account/account.api";
import { selectUsers } from "@/services/admin/admin.api";
import { selectOrders } from "@/services/orders";
import { formatEurValue, formatValue } from "@/utils/formatters";

import { selectIsAdminUser } from "../account";
import { OrderBookData, OrderWithUser } from "./orders.types";

const isOpenOrder = (order: OrderWithUser) =>
  !SettledOrderStatuses.includes(order.status as OrderStatus) &&
  order.type !== OrderType.MARKET;

const isSettledOrder = (order: OrderWithUser) =>
  SettledOrderStatuses.includes(order.status as OrderStatus);

const formatOrderData = (order: OrderWithUser): OrderBookData => {
  const { base, quote } = order.market_item;
  const pair = `${base}/${quote}`;
  const isFilled = order.status === OrderStatus.FILLED;
  const { amountPrecision } = getAssetDetails(base);
  const initialAmountValue = Number(order.amount);
  const executedAmountValue = Number(order.executed.amount);
  const amountValue = isFilled ? executedAmountValue : initialAmountValue;
  const executedPriceValue = Number(order.executed.price);
  const initialPriceValue = Number(order.limit_price);
  const totalValue = Number(order.executed.value);
  const orderCreationDate = new Date(order.created);
  const orderFinishedDate = order.finished ? new Date(order.finished) : null;
  const side = order.action as ExecutionSide;
  const type = order.type as OrderType;
  const status = order.status as OrderStatus;
  const id = `${order.code}-${order.created}`;
  const isOpen = isOpenOrder(order);
  const isExecutedPriceInvalid = !executedPriceValue;

  const isValidFinishedDate =
    orderFinishedDate && dateFns.isAfter(orderFinishedDate, new Date(1970));
  const createdDate = dateFns.format(orderCreationDate, "yyyy-MM-dd");
  const createdTime = dateFns.format(orderCreationDate, "HH:mm:ss");
  const finishedDate = orderFinishedDate
    ? dateFns.format(
        isValidFinishedDate ? orderFinishedDate : orderCreationDate,
        "yyyy-MM-dd"
      )
    : Symbols.NoValue;
  const finishedTime = orderFinishedDate
    ? dateFns.format(
        isValidFinishedDate ? orderFinishedDate : orderCreationDate,
        "HH:mm:ss"
      )
    : Symbols.NoValue;
  const date = isFilled ? finishedDate : createdDate;
  const time = isFilled ? finishedTime : createdTime;
  const initialAmount = formatValue(initialAmountValue, amountPrecision);
  const executedAmount = formatValue(executedAmountValue, amountPrecision);
  const amount = isFilled ? executedAmount : initialAmount;
  const priceBase = formatValue(
    isOpen ? initialPriceValue : executedPriceValue
  );
  const price = formatEurValue(
    isOpen || isExecutedPriceInvalid ? initialPriceValue : executedPriceValue
  );
  const total = formatEurValue(
    totalValue ||
      new BigNumber(initialPriceValue).multipliedBy(amountValue).toNumber()
  );
  const filledPercentageValue = new BigNumber(executedAmountValue)
    .dividedBy(initialAmountValue)
    .multipliedBy(100);
  const isPartial =
    filledPercentageValue.isLessThan(100) &&
    filledPercentageValue.isGreaterThan(0);
  const filledPercentage =
    filledPercentageValue.isNaN() || !isPartial
      ? ""
      : filledPercentageValue.toFixed(0);
  const percentageValue = filledPercentageValue.isNaN()
    ? 0
    : filledPercentageValue.toNumber();

  return {
    id,
    orderId: order.code,
    createdDate,
    createdTime,
    finishedDate,
    finishedTime,
    date,
    time,
    base,
    quote,
    pair,
    side,
    type,
    initialAmount,
    executedAmount,
    amount,
    priceBase,
    price,
    total,
    status,
    filledPercentage,
    filledPercentageValue: percentageValue,
    isPartial,
    isOpen,
    user: order.user,
    userCode: order.userCode,
    role: order.role,
  };
};

const memoizeOptions = {
  memoizeOptions: {
    resultEqualityCheck: (prev: OrderBookData[], curr: OrderBookData[]) => {
      const reducerFn = (acc: string, entry: OrderBookData) =>
        `${acc}${entry.id}_${entry.amount}_${entry.total}_${entry.executedAmount}_${entry.status}_${entry.user}`;
      const prevIdentifier = prev.reduce(reducerFn, "");
      const currIdentifier = curr.reduce(reducerFn, "");

      return prevIdentifier === currIdentifier;
    },
  },
};

export const selectCombinedOrders = createSelector(
  [selectOrders, selectUsers],
  (orders = [], users = []) =>
    orders.map((order) => {
      const user = users.find((user) => user.code === order.creator_code);

      return {
        ...order,
        userCode: user?.code ?? "",
        user: user?.name ?? "",
        role: user?.role ?? "",
      };
    }),
  memoizeOptions
);

export const selectOpenOrders = createSelector(
  selectCombinedOrders,
  (orders = []) => orders.filter(isOpenOrder).map(formatOrderData),
  memoizeOptions
);

export const selectUserOpenOrders = createSelector(
  [selectUserProfile, selectIsAdminUser, selectOpenOrders],
  (user, isAdmin, orders = []) => {
    if (isAdmin) return orders;

    return orders.filter((order) => order.userCode === user?.code);
  },
  memoizeOptions
);

export const selectSettledOrders = createSelector(
  selectCombinedOrders,
  (orders = []) =>
    orders.filter(isSettledOrder).map((order) => {
      const orderData = formatOrderData(order);
      const feeValue = new BigNumber(order.executed.bank_fee)
        .plus(order.executed.broker_fee)
        .toNumber();
      const fee = feeValue ? formatValue(feeValue, 3) : Symbols.NoValue;

      return {
        ...orderData,
        fee,
      };
    }),
  memoizeOptions
);

export const selectUserSettledOrders = createSelector(
  [selectUserProfile, selectIsAdminUser, selectSettledOrders],
  (user, isAdmin, orders = []) => {
    if (isAdmin) return orders;

    return orders.filter((order) => order.userCode === user?.code);
  },
  memoizeOptions
);

export const selectSettledOrder = (id: string) =>
  createSelector(selectSettledOrders, (orders = []) =>
    orders.find((order) => order.id === id)
  );
