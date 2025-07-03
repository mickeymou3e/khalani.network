import BigNumber from "bignumber.js";

import { AccountType, areAssetsEqual } from "@/definitions/config";
import { FiatCurrencies } from "@/definitions/types";
import { Balance } from "@/services/balances";
import { RateData } from "@/store/rates";
import { formatEurValue, formatValue } from "@/utils/formatters";
import { evaluate } from "@/utils/logic";

import { BalanceValues } from "./balances.types";

export const convertToQuote = (value: number, exchangeRate: number) =>
  new BigNumber(value).multipliedBy(exchangeRate).toNumber();

const formatBalanceValue = (value: number, quote = false) => {
  const formatterFn = quote ? formatEurValue : formatValue;

  return formatterFn(value);
};

export const getBaseBalances = (
  balance: Balance,
  custodyWalletCodes: string[],
  customerCode: string
): BalanceValues => {
  const tradingBalanceAccount = balance.accounts.find(
    (account) =>
      account.type === AccountType.TradingWallet &&
      custodyWalletCodes.includes(account.code)
  );
  const virtualBalanceAccount = balance.accounts.find(
    (account) =>
      [AccountType.VirtualWallet, AccountType.CustomerTrading].includes(
        account.type
      ) && customerCode === account.code
  );
  const isFiat = balance.is_fiat ?? false;

  const availableToAuxValue = isFiat
    ? Number(virtualBalanceAccount?.available)
    : Number(tradingBalanceAccount?.available);
  const lockedValue = isFiat ? 0 : Number(virtualBalanceAccount?.available);
  const availableToTradeValue = new BigNumber(availableToAuxValue)
    .plus(lockedValue)
    .toNumber();
  const inOrdersValue = isFiat
    ? Number(virtualBalanceAccount?.locked)
    : Number(tradingBalanceAccount?.locked);
  const totalValue = new BigNumber(availableToTradeValue)
    .plus(inOrdersValue)
    .toNumber();

  return {
    availableToAuxValue,
    availableToAux: formatBalanceValue(availableToAuxValue),
    availableToTradeValue,
    availableToTrade: formatBalanceValue(availableToTradeValue),
    lockedValue,
    locked: formatBalanceValue(lockedValue),
    inOrdersValue,
    inOrders: formatBalanceValue(inOrdersValue),
    totalValue,
    total: formatBalanceValue(totalValue),
  };
};

export const getQuoteBalances = (
  baseBalances: BalanceValues,
  rates: RateData[],
  baseAsset: string
): BalanceValues => {
  const rateDetails = rates.find((rate) =>
    areAssetsEqual(rate.base, baseAsset)
  );
  const price = evaluate<number>(
    [true, 0],
    [baseAsset === FiatCurrencies.EUR, 1],
    [Boolean(rateDetails?.marketPriceValue), rateDetails?.marketPriceValue]
  )!;

  const availableToAuxValue = convertToQuote(
    baseBalances.availableToAuxValue,
    price
  );
  const availableToTradeValue = convertToQuote(
    baseBalances.availableToTradeValue,
    price
  );
  const lockedValue = convertToQuote(baseBalances.lockedValue, price);
  const inOrdersValue = convertToQuote(baseBalances.inOrdersValue, price);
  const totalValue = convertToQuote(baseBalances.totalValue, price);

  return {
    availableToAuxValue,
    availableToAux: formatBalanceValue(availableToAuxValue, true),
    availableToTradeValue,
    availableToTrade: formatBalanceValue(availableToTradeValue, true),
    lockedValue,
    locked: formatBalanceValue(lockedValue, true),
    inOrdersValue,
    inOrders: formatBalanceValue(inOrdersValue, true),
    totalValue,
    total: formatBalanceValue(totalValue, true),
  };
};
