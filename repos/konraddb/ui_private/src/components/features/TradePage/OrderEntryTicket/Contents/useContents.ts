import { useEffect } from "react";
import { FormikProps, useFormik } from "formik";
import { useTranslation } from "next-i18next";

import { getAssetDetails } from "@/definitions/config";
import { ExecutionSide, OrderType } from "@/definitions/types";
import { useLoggedOutEffect } from "@/hooks/account";
import { useSubmitOrderMutation } from "@/services/orders";
import { useAppSelector } from "@/store";
import { selectNeutralCustomerCode } from "@/store/account";
import { selectGuaranteedSelectedAssetAmount } from "@/store/assets";
import {
  selectEuroBalance,
  selectSelectedAssetBalance,
} from "@/store/balances/balances.selectors";
import { selectSelectedAssetRateDetails } from "@/store/rates";
import {
  selectOfflineStatus,
  selectSelectedTicketValues,
} from "@/store/ui/ui.selectors";
import { validateFields } from "@/utils/formik";

import { namespace } from "../config";
import {
  calculateAvailableAmount,
  calculateTotalInQuote,
  createOrder,
} from "./Contents.helpers";
import { ContentsProps, OrderFormProps } from "./Contents.types";
import {
  limitValidationSchema,
  marketValidationSchema,
} from "./Contents.validations";

const initialValues = {
  price: "",
  amount: "",
  sliderValue: 0,
  total: 0,
  available: 0,
  guaranteed: 0,
  online: true,
  config: {
    base: "",
    quote: "",
    minAmount: 0,
    marketPrice: 0,
    side: ExecutionSide.BUY,
  },
};

export const useContents = (): ContentsProps => {
  const { t } = useTranslation(namespace);
  const assetRateDetails = useAppSelector(selectSelectedAssetRateDetails);
  const ticketValues = useAppSelector(selectSelectedTicketValues);
  const customerCode = useAppSelector(selectNeutralCustomerCode);
  const baseBalance = useAppSelector(selectSelectedAssetBalance);
  const quoteBalance = useAppSelector(selectEuroBalance);
  const isOfflineStatus = useAppSelector(selectOfflineStatus);
  const [submitOrder] = useSubmitOrderMutation();
  const assetConfig = getAssetDetails(assetRateDetails?.base);
  const guaranteedAmount = useAppSelector(selectGuaranteedSelectedAssetAmount);
  const isLimit = ticketValues.orderType === OrderType.LIMIT;
  const isBuySide = ticketValues.side === ExecutionSide.BUY;
  const balance = isBuySide
    ? quoteBalance?.base.availableToTradeValue ?? 0
    : baseBalance?.base.availableToTradeValue ?? 0;
  const price = isBuySide
    ? assetRateDetails?.askPriceValue
    : assetRateDetails?.bidPriceValue;
  const isValid = price > 0 && balance > 0;
  const priceLabel = t(`${namespace}:price`);

  const formik: FormikProps<OrderFormProps> = useFormik({
    initialValues,
    validationSchema: isLimit ? limitValidationSchema : marketValidationSchema,
    onSubmit: async (formValues) => {
      const order = createOrder({
        assetRateDetails,
        ticketValues,
        formValues,
        customerCode,
      });

      await submitOrder(order);

      formik.resetForm();
    },
  });

  const setAmounts = () => {
    const availableAmount = calculateAvailableAmount(
      formik,
      price,
      balance,
      isBuySide
    );

    formik.setFieldValue("available", availableAmount);
    formik.setFieldValue("guaranteed", guaranteedAmount);
  };

  const setTotal = () => {
    const total = calculateTotalInQuote(formik, price, isLimit);

    formik.setFieldValue("total", total);
  };

  useEffect(() => {
    formik.resetForm();
    setAmounts();
    setTotal();
  }, [ticketValues.orderType, ticketValues.side, assetRateDetails?.base]);

  useEffect(() => {
    setAmounts();
    setTotal();
    validateFields(formik, "total", "amount");
  }, [formik.values.amount, formik.values.price, price]);

  useEffect(() => {
    if (!assetRateDetails) return;

    formik.setFieldValue("config", {
      base: assetRateDetails.base,
      quote: assetRateDetails.quote,
      marketPrice: price,
      side: ticketValues.side,
      minAmount: assetConfig.minAmount,
    });
  }, [assetRateDetails]);

  useEffect(() => {
    formik.setFieldValue("online", !isOfflineStatus);
  }, [isOfflineStatus]);

  useLoggedOutEffect(() => formik.resetForm());

  return {
    formik,
    assetDetails: assetRateDetails,
    assetConfig,
    ticketValues,
    isLimit,
    isBuySide,
    balance,
    price,
    guaranteedAmount,
    isValid,
    namespace,
    priceLabel,
  };
};
