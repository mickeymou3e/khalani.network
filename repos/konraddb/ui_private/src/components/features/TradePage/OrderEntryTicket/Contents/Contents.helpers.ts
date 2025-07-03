import BigNumber from "bignumber.js";
import { FormikProps } from "formik";

import { ExecutionSide, OrderType } from "@/definitions/types";
import { RateData } from "@/store/rates";
import { TicketValues } from "@/store/ui";
import { convertToBaseAmount } from "@/utils/number";

import { OrderFormProps } from "./Contents.types";

export const calculateAvailableAmount = (
  formik: FormikProps<OrderFormProps>,
  marketPrice: number,
  amount: number,
  shouldConvertToBase: boolean
) =>
  shouldConvertToBase
    ? convertToBaseAmount(
        amount,
        parseFloat(formik.values.price) || marketPrice || 1
      )
    : amount;

export const calculateTotalInQuote = (
  formik: FormikProps<OrderFormProps>,
  price: number,
  isLimit: boolean
) => {
  const calcPrice = isLimit ? BigNumber(formik.values.price) : BigNumber(price);
  return (
    calcPrice.multipliedBy(parseFloat(formik.values.amount)).toNumber() || 0
  );
};

export type CreateOrderProps = {
  assetRateDetails: RateData;
  ticketValues: TicketValues;
  formValues: {
    price: string;
    amount: string;
  };
  customerCode: string;
};

export const createOrder = ({
  assetRateDetails,
  ticketValues,
  formValues,
  customerCode,
}: CreateOrderProps) => {
  const isLimit = ticketValues.orderType === OrderType.LIMIT;
  const isBuySide = ticketValues.side === ExecutionSide.BUY;
  const marketPrice = isBuySide
    ? assetRateDetails?.askPriceUnformatted
    : assetRateDetails?.bidPriceUnformatted;
  const limitPrice = isLimit ? formValues.price.toString() : "";
  const rfqOfferedPrice = isLimit ? "" : marketPrice;

  return {
    base: assetRateDetails?.base,
    quote: assetRateDetails?.quote,
    action: ticketValues.side,
    limit_price: limitPrice,
    reference_id: "",
    type: ticketValues.orderType,
    rfq_offered_price_timestamp: assetRateDetails.timestamp,
    customer_code: customerCode,
    rfq_offered_price: rfqOfferedPrice,
    rfq_quote_amount: "",
    amount: formValues.amount.toString(),
  };
};
