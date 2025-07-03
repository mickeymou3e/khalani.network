import { FormikProps } from "formik";
import { useTranslation } from "next-i18next";

import { Fees } from "@/components/molecules";
import { Backdrops, FiatCurrencies, Symbols } from "@/definitions/types";
import { selectCustomer } from "@/services/account";
import { useAppDispatch, useAppSelector } from "@/store";
import { openBackdrop } from "@/store/backdrops";
import { selectSelectedAsset } from "@/store/wallet";
import { formatValue } from "@/utils/formatters";
import { calculatePrecision } from "@/utils/number";

import { namespace } from "../../config";

interface UseFiatWithdrawSummaryProps {
  formik: FormikProps<any>;
}

export const useFiatWithdrawSummary = ({
  formik,
}: UseFiatWithdrawSummaryProps) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();

  const neutralCustomer = useAppSelector(selectCustomer);
  const selectedAsset = useAppSelector(selectSelectedAsset);

  const userIbans =
    neutralCustomer?.ibans.filter(
      (iban) => iban.currency === FiatCurrencies.EUR
    ) || [];

  const requestedAmount = formik.values.amount;
  const isFormValidToDisplay = requestedAmount > 0 && !formik.errors.amount;

  const bankDetails = [
    {
      label: t(`${namespace}:accountHolder`),
      value: userIbans[0].accountHolder,
    },
    {
      label: t(`${namespace}:bankName`),
      value: userIbans[0]?.bankName,
    },
    {
      label: t(`${namespace}:swiftCode`),
      value: userIbans[0]?.swift,
    },
  ];

  const withdrawalDetails = [
    {
      label: t(`${namespace}:amount`),
      value: isFormValidToDisplay
        ? formatValue(requestedAmount, calculatePrecision(requestedAmount))
        : Symbols.NoValue,
    },
    {
      label: t(`${namespace}:fees`),
      value: (
        <Fees
          fee={
            isFormValidToDisplay
              ? formatValue(
                  formik.values.amount *
                    Number(process.env.NEXT_PUBLIC_WITHDRAWAL_FEE_MULTIPLIER),
                  calculatePrecision(
                    formik.values.amount *
                      Number(process.env.NEXT_PUBLIC_WITHDRAWAL_FEE_MULTIPLIER)
                  )
                )
              : Symbols.NoValue
          }
          discountFee={
            isFormValidToDisplay ? Symbols.ZeroBalance : Symbols.NoValue
          }
        />
      ),
    },
    {
      label: t(`${namespace}:youWillReceive`),
      value: isFormValidToDisplay
        ? formatValue(requestedAmount, calculatePrecision(requestedAmount))
        : Symbols.NoValue,
    },
  ];

  const handleOpenSupportModal = () => {
    dispatch(openBackdrop(Backdrops.CONTACT_US));
  };

  return {
    userIbans,
    bankDetails,
    withdrawalDetails,
    selectedAsset,
    handleOpenSupportModal,
  };
};
