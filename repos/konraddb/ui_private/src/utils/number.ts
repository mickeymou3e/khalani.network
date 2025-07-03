import BigNumber from "bignumber.js";

import { evaluate } from "@/utils/logic";

export const calculatePrecision = (num: number) => {
  const exponent = Math.floor(Math.log10(Math.abs(num)));

  return exponent >= 0 ? 2 : ((Math.abs(exponent) + 1) as number);
};

export const calculatePrecisionBasedOnPrice = (num: number) => {
  const exponent = Math.floor(Math.log10(Math.abs(num)));

  return evaluate(
    [exponent < -2, 0],
    [exponent >= -2, 2],
    [exponent >= 0, 4]
  ) as number;
};

export const convertToBaseAmount = (amount: number, rate: number) =>
  new BigNumber(amount).div(rate).toNumber();

export const convertToQuoteAmount = (amount: number, rate: number) =>
  new BigNumber(amount).multipliedBy(rate).toNumber();

export const convertToPrecision = (tickSize: number) => {
  if (tickSize >= 1 || tickSize <= 0) throw new Error("Invalid tick size");

  return Math.log10(1 / tickSize);
};
