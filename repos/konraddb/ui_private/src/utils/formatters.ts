import BigNumber from "bignumber.js";

import { evaluate } from "@/utils/logic";

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

interface FormatNumberOptions {
  base?: number;
  prefix?: string;
  suffix?: string;
  token?: string;
  showSign?: boolean;
  withThousandSeparator?: boolean;
}

export const formatNumber = (
  num: BigNumber | number,
  {
    base = 2,
    prefix = "",
    suffix = "",
    token = "",
    showSign = false,
    withThousandSeparator = true,
  }: FormatNumberOptions = {}
) => {
  const convertedNum = new BigNumber(num);

  if (convertedNum.isNaN()) return "";

  const roundedNum = convertedNum.decimalPlaces(base);
  const calculatedSuffix = suffix || (token ? ` ${token}` : "");
  const calculatedSign = showSign && roundedNum.gt(0) ? "+" : "";
  const formattedAmount = roundedNum.toFormat(
    base,
    defaultFormat(
      withThousandSeparator,
      calculatedSign || prefix,
      calculatedSuffix
    )
  );

  return formattedAmount;
};

export const toFixedNumber = (amount: number, base = 2) =>
  formatNumber(amount, { base, withThousandSeparator: false });

export const formatValue = (value: number, base = 2) =>
  formatNumber(value, { base });

const divideAndFormat = (
  amount: number,
  divident: number,
  base: number,
  suffix: string
) => {
  const dividedNumber = new BigNumber(amount).div(divident).toNumber();
  return formatNumber(dividedNumber, { base, suffix });
};

export const formatShortValue = (amount: number, base = 2) =>
  evaluate(
    [true, divideAndFormat(amount, 1_000_000_000, base, "b")],
    [amount < 1_000_000_000, divideAndFormat(amount, 1_000_000, base, "m")],
    [amount < 1_000_000, divideAndFormat(amount, 1_000, base, "k")],
    [amount < 1_000, formatNumber(amount, { base })]
  ) as string;

export const formatEurValue = (value: number, base = 2) =>
  formatNumber(value, { base, suffix: " EUR" });

export const formatUsdValue = (value: number, base = 2) =>
  formatNumber(value, { base, prefix: "$" });

export const formatPercentage = (
  value: number,
  base = 0,
  options: FormatNumberOptions = {}
) =>
  value > 0 && value < 1
    ? "<1%"
    : formatNumber(value, { base, suffix: "%", ...options });

export const formatSentence = (value: string) =>
  `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;

export const hideNumericValues = (input: string, length = 6) => {
  const val = input.replace(/[.,]/g, "");

  return val.replace(/\d+/g, "*".repeat(length));
};

export const createAsterisks = (length = 6) => "*".repeat(length);
