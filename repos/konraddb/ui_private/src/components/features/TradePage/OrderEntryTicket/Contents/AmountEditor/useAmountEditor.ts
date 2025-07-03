import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import { Symbols } from "@/definitions/types";
import { useAppSelector } from "@/store";
import { selectIsValidLogin } from "@/store/auth";
import { formatValue } from "@/utils/formatters";
import { validateFields } from "@/utils/formik";

import { namespace } from "../../config";
import { ContentsProps } from "../Contents.types";

const getAdjustedPercentage = (amount: number, availableAmount: number) =>
  new BigNumber(amount).dividedBy(availableAmount).multipliedBy(100).toNumber();

const getAdjustedAmount = (amount: number, availableAmount: number) =>
  new BigNumber(availableAmount)
    .multipliedBy(amount)
    .dividedBy(100)
    .decimalPlaces(4, BigNumber.ROUND_DOWN)
    .toNumber();

const useAmountEditor = ({
  formik,
  assetDetails,
  guaranteedAmount,
  ticketValues,
}: ContentsProps) => {
  const { t } = useTranslation(namespace);
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const asset = assetDetails?.base;
  const guaranteed =
    asset && isLoggedIn
      ? formatValue(guaranteedAmount ?? 0)
      : Symbols.NoBalance;
  const guaranteedText = `${guaranteed} ${asset ?? ""}`;
  const maxAmount = Math.min(formik.values.available, guaranteedAmount);

  const amountLabel = t(`${namespace}:amount`);
  const orderTypeText = t(`${namespace}:${ticketValues.orderType}`);
  const guaranteedAmountLabel = t(`${namespace}:maxAmount`);
  const guaranteedAmountHint = t(`${namespace}:maxAmountHint`, {
    type: orderTypeText,
  });
  const sideText = t(`${namespace}:${ticketValues.side}`);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = event.target.value;
    formik.setFieldValue("amount", amount);

    const adjustedPercentage = getAdjustedPercentage(Number(amount), maxAmount);
    formik.setFieldValue("sliderValue", Math.min(100, adjustedPercentage));

    validateFields(formik, "amount");
  };

  const handleSliderChange = (_: Event, value: number | number[]) => {
    const adjustedAmount = getAdjustedAmount(value as number, maxAmount);
    formik.setFieldValue("amount", adjustedAmount);

    formik.setFieldValue("sliderValue", value);

    validateFields(formik, "amount");
  };

  useEffect(() => {
    const adjustedPercentage = getAdjustedPercentage(
      Number(formik.values.amount),
      maxAmount
    );
    formik.setFieldValue("sliderValue", Math.min(100, adjustedPercentage));

    validateFields(formik, "amount");
  }, [maxAmount]);

  return {
    guaranteed,
    guaranteedText,
    amountLabel,
    guaranteedAmountLabel,
    guaranteedAmountHint,
    orderTypeText,
    sideText,
    handleAmountChange,
    handleSliderChange,
  };
};

export default useAmountEditor;
