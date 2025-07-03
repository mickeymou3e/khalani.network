import { useTranslation } from "next-i18next";

import { FiatCurrencies } from "@/definitions/types";
import { selectCustomer } from "@/services/account/account.api";
import { useAppSelector } from "@/store";

import { createColumnConfig, namespace } from "./config";

export const useBanks = () => {
  const { t } = useTranslation(namespace);
  const neutralCustomer = useAppSelector(selectCustomer);

  const columnConfig = createColumnConfig(t);

  const dataProvider = neutralCustomer?.ibans.filter(
    (iban) => iban.currency === FiatCurrencies.EUR
  );

  return {
    dataProvider,
    columnConfig,
  };
};
