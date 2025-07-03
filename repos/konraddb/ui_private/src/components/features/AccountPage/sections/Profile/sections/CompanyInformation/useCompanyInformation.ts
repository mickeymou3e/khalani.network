import { useTranslation } from "next-i18next";

import { Symbols } from "@/definitions/types";
import { selectCustomer } from "@/services/account";
import { useAppSelector } from "@/store";
import { selectHideAccountValues } from "@/store/ui/ui.selectors";
import { createAsterisks } from "@/utils/formatters";

import { namespace } from "../../config";

export enum ListChildrenType {
  "currency" = "currency",
}

export const useCompanyInformation = () => {
  const { t } = useTranslation(namespace);
  const asterisks = createAsterisks();
  const hideValues = useAppSelector(selectHideAccountValues);

  const neutralCustomer = useAppSelector(selectCustomer);

  const companyInformationLabel = t(`${namespace}:companyInformation`);
  const companyLabel = t(`${namespace}:company`);
  const phoneNumberLabel = t(`${namespace}:phoneNumber`);
  const emailLabel = t(`${namespace}:email`);
  const addressLabel = t(`${namespace}:address`);
  const zipCodeLabel = t(`${namespace}:zipCode`);
  const cityLabel = t(`${namespace}:city`);
  const countryLabel = t(`${namespace}:country`);
  const vatLabel = t(`${namespace}:vat`);
  const ibanLabel = t(`${namespace}:iban`);
  const currencyLabel = t(`${namespace}:currency`);

  const informationList = [
    {
      label: companyLabel,
      value: hideValues
        ? asterisks
        : neutralCustomer?.company_name || Symbols.NoValue,
    },
    {
      label: phoneNumberLabel,
      value: hideValues
        ? asterisks
        : neutralCustomer?.phone_number || Symbols.NoValue,
    },
    {
      label: emailLabel,
      value: hideValues ? asterisks : neutralCustomer?.email || Symbols.NoValue,
    },
    {
      label: addressLabel,
      value: hideValues
        ? asterisks
        : neutralCustomer?.address || Symbols.NoValue,
    },
    {
      label: zipCodeLabel,
      value: hideValues
        ? asterisks
        : neutralCustomer?.zip_code || Symbols.NoValue,
    },
    {
      label: cityLabel,
      value: hideValues ? asterisks : neutralCustomer?.city || Symbols.NoValue,
    },
    {
      label: countryLabel,
      value: hideValues
        ? asterisks
        : neutralCustomer?.country || Symbols.NoValue,
    },
    {
      label: vatLabel,
      value: hideValues ? asterisks : neutralCustomer?.vat || Symbols.NoValue,
    },
    {
      label: ibanLabel,
      value: hideValues
        ? asterisks
        : neutralCustomer?.ibans[0]?.iban || Symbols.NoValue,
    },
    {
      label: currencyLabel,
      value: hideValues
        ? asterisks
        : neutralCustomer?.ibans[0]?.currency || Symbols.NoValue,
      component: hideValues ? "" : ListChildrenType.currency,
    },
  ];

  const tradingFeeLabel = t(`${namespace}:tradingFee`);
  const alphaLaunchRewardLabel = t(`${namespace}:alphaLaunchReward`);

  const tradingFeeValue = hideValues ? asterisks : 0;

  return {
    companyInformationLabel,
    informationList,
    tradingFeeLabel,
    alphaLaunchRewardLabel,
    tradingFeeValue,
  };
};
