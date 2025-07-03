import { FormikProps } from "formik";

import { AssetConfigEntry } from "@/definitions/config";
import { ExecutionSide, OrderType } from "@/definitions/types";
import { RateData } from "@/store/rates";

export type OrderFormProps = {
  amount: string;
  price: string;
  total: number;
  sliderValue: number;
  available: number;
  guaranteed: number;
  online: boolean;
  config: {
    base: string;
    quote: string;
    marketPrice: number;
    side: ExecutionSide;
    minAmount: number;
  };
};

export type ContentsProps = {
  formik: FormikProps<OrderFormProps>;
  assetDetails: RateData;
  assetConfig: AssetConfigEntry;
  ticketValues: {
    orderType: OrderType;
    side: ExecutionSide;
  };
  isLimit: boolean;
  isBuySide: boolean;
  balance: number;
  price: number;
  guaranteedAmount: number;
  isValid: boolean;
  namespace: string;
  priceLabel: string;
};
