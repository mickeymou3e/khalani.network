import BigNumber from "bignumber.js";

import { evaluate } from "./logic";
import {
  FormatNumberOptions,
  FormatPercentageOptions,
} from "./formatters.types";

const defaultFormat = (
  withThousandSeparator = true,
  prefix = "",
  suffix = ""
) => ({
  decimalSeparator: ".",
  groupSeparator: withThousandSeparator ? "," : "",
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: " ",
  fractionGroupSize: 0,
  prefix,
  suffix,
});

export const formatNumber = (
  num: BigNumber | number,
  {
    base = 2,
    prefix = "",
    suffix = "",
    token = "",
    showSign = false,
    withThousandSeparator = true,
    roundUp = false,
    forceTwoDecimals,
    roundEnable = true,
  }: FormatNumberOptions = {}
) => {
  const convertedNum = new BigNumber(num);
  if (convertedNum.isNaN()) return "";
  if (convertedNum.isLessThan(0.01) && !convertedNum.isZero()) return `<0.01`;

  const isNegative = convertedNum.isNegative();
  const actualDecimals = convertedNum.decimalPlaces();
  let effectiveBase = base;

  if (!forceTwoDecimals) {
    effectiveBase = Math.max(2, actualDecimals ?? 0);
  }

  let roundedNum = convertedNum.decimalPlaces(effectiveBase);
  if (roundEnable) {
    roundedNum = convertedNum.decimalPlaces(
      effectiveBase,
      roundUp ? BigNumber.ROUND_UP : BigNumber.ROUND_DOWN
    );
  }
  if (isNegative && showSign) {
    return new BigNumber(0).toFormat(1);
  }

  const calculatedSuffix = suffix || (token ? ` ${token}` : "");
  const calculatedSign = showSign && roundedNum.gt(0) ? "+" : "";

  const formattedAmount = roundedNum.toFormat(
    effectiveBase,
    defaultFormat(
      withThousandSeparator,
      calculatedSign || prefix,
      calculatedSuffix
    )
  );

  return formattedAmount;
};

export const toFixedNumber = (amount: number, base = 2) =>
  formatNumber(amount, {
    base,
    withThousandSeparator: false,
    forceTwoDecimals: true,
  });

export const formatValue = (
  value: number,
  forceTwoDecimals = true,
  base = 2,
  roundUp = false
) => formatNumber(value, { base, forceTwoDecimals, roundUp });

const divideAndFormat = (
  amount: number,
  divident: number,
  base: number,
  suffix: string
) => {
  const dividedNumber = new BigNumber(amount).div(divident).toNumber();
  return formatNumber(dividedNumber, {
    base,
    suffix,
    forceTwoDecimals: true,
    roundEnable: false,
  });
};

export const formatShortValue = (amount: number, base = 2) =>
  evaluate(
    [true, divideAndFormat(amount, 1_000_000_000, base, "b")],
    [amount < 1_000_000_000, divideAndFormat(amount, 1_000_000, base, "m")],
    [amount < 1_000_000, divideAndFormat(amount, 1_000, base, "k")],
    [amount < 1_000, formatNumber(amount, { base, forceTwoDecimals: true })]
  ) as string;

export const formatEurValue = (value: number, base = 2) =>
  formatNumber(value, { base, suffix: " EUR", forceTwoDecimals: true });

export const formatUsdValue = (value: number, base = 2) =>
  formatNumber(value, { base, prefix: "$", forceTwoDecimals: true });

export const formatPercentage = (
  value: number,
  options: FormatPercentageOptions = {
    skipNumberFormat: false,
    threshold: -Infinity,
  }
) =>
  evaluate<string>(
    [
      true,
      formatNumber(value, {
        base: 0,
        suffix: "%",
        forceTwoDecimals: true,
        ...options,
      }),
    ],
    [options.skipNumberFormat!, `${value}%`],
    [value < options.threshold!, `<${options.threshold!}%`]
  )!;

export const formatSentence = (value: string) =>
  `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;

export const hideNumericValues = (input: string, length = 6) => {
  const val = input.replace(/[.,]/g, "");

  return val.replace(/\d+/g, "*".repeat(length));
};

export const createAsterisks = (length = 6) => "*".repeat(length);

export const formatAddress = (
  address: string | undefined,
  firstDigits = 6,
  lastDigits = 5
) =>
  address?.length
    ? `${address.substring(0, firstDigits)}...${address.substring(
        address.length - lastDigits
      )}`
    : "-";

export const formatCode = (code: string | undefined) =>
  code?.length ? code.substring(0, 8) : "-";

export const roundDownAmount = (
  amount: number | undefined,
  isFiat?: boolean
) => {
  const value = new BigNumber(amount ?? 0)
    .decimalPlaces(isFiat ? 2 : 0, BigNumber.ROUND_DOWN)
    .toString();
  return value;
};

export const formatBatch = (input: string) =>
  `${input.substring(0, 5)}...${input.substring(input.length - 4)}`;
