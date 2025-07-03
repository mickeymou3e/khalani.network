import { useTranslation } from "next-i18next";

import { Symbols } from "@/definitions/types";
import { formatEurValue, formatValue } from "@/utils/formatters";

import { namespace } from "../../config";
import { TransactionDetailsProps } from "./TransactionDetails";

export const useTransactionDetails = ({
  total,
  minAmount,
  marketPrice,
  isLimit,
  isBuySide,
  formik,
}: TransactionDetailsProps) => {
  const { t } = useTranslation([namespace]);
  const shouldShowWarningNotification = total > 0 && total < minAmount;
  const shouldShowInfoNotification =
    total >= minAmount && !isLimit && formik.isValid;
  const shouldShowNotification =
    shouldShowWarningNotification || shouldShowInfoNotification;
  const notificationVariant = shouldShowWarningNotification ? "error" : "info";
  const warningNotificationText = t(`${namespace}:totalMustBeGreater`, {
    amount: formatEurValue(minAmount, 0),
  });
  const infoNotificationText = t(`${namespace}:exectuionNotice`);
  const notificationText = shouldShowWarningNotification
    ? warningNotificationText
    : infoNotificationText;
  const transactionDetailsText = t(`${namespace}:transactionDetails`);
  const priceLabelText = isBuySide
    ? t(`${namespace}:buyPrice`)
    : t(`${namespace}:sellPrice`);
  const feeLabelText = t(`${namespace}:fee`);
  const totalLabelText = t(`${namespace}:total`);

  const isAmountValid = formik.values.amount && !formik.errors.amount;

  const marketPriceText =
    marketPrice && isAmountValid ? formatValue(marketPrice) : Symbols.NoBalance;

  const calculatedFeeValue = formatValue(
    total * Number(process.env.NEXT_PUBLIC_TRADING_FEE_MULTIPLIER)
  );
  const feeText =
    total && isAmountValid ? calculatedFeeValue : Symbols.NoBalance;

  const totalText =
    total && isAmountValid ? formatValue(total) : Symbols.NoBalance;

  return {
    shouldShowNotification,
    notificationVariant,
    notificationText,
    marketPriceText,
    feeText,
    totalText,
    transactionDetailsText,
    priceLabelText,
    feeLabelText,
    totalLabelText,
  };
};
