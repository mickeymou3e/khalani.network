import * as yup from "yup";

import { ExecutionSide } from "@/definitions/types";

export const amountValidator = yup
  .number()
  .min(0.00000001, "")
  .typeError("")
  .test({
    name: "guaranteed amount test",
    message: "maxGuaranteedAmount",

    test: (value, context) => !value || value <= context.parent.guaranteed,
  })
  .test({
    name: "amount test",
    message: "insufficientBalance",

    test: (value, context) => !value || value <= context.parent.available,
  })
  .required("");

export const priceValidator = yup
  .number()
  .test({
    name: "acceptable price test",
    message: "",
    test: (value, context) => {
      if (!value) return true;

      const isBuy = context.parent.config.side === ExecutionSide.BUY;
      const { marketPrice } = context.parent.config;

      if (isBuy && value > marketPrice)
        return context.createError({ message: "buyLimitError" });
      if (!isBuy && value < marketPrice)
        return context.createError({ message: "sellLimitError" });

      return true;
    },
  })
  .required("");

export const totalValidator = yup.number().test({
  name: "min amount test",
  message: "",
  test: (value, context) => !value || value >= context.parent.config.minAmount,
});

export const onlineValidator = yup.boolean().isTrue();

export const limitValidationSchema = yup.object({
  price: priceValidator,
  amount: amountValidator,
  total: totalValidator,
  online: onlineValidator,
});

export const marketValidationSchema = yup.object({
  amount: amountValidator,
  total: totalValidator,
  online: onlineValidator,
});
