import { FormikProps } from "formik";
import { useTranslation } from "next-i18next";

import { Fees } from "@/components/molecules";
import { Backdrops, Symbols } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { openBackdrop } from "@/store/backdrops/backdrops.store";
import {
  selectBlockchainNetwork,
  selectCryptoDepositAddress,
  selectSelectedAsset,
  selectSelectedAssetDetails,
} from "@/store/wallet";
import { formatValue } from "@/utils/formatters";
import { calculatePrecision } from "@/utils/number";

import { namespace } from "../../config";

interface UseCryptoWithdrawSummaryProps {
  formik: FormikProps<any>;
}

export const useCryptoWithdrawSummary = ({
  formik,
}: UseCryptoWithdrawSummaryProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(namespace);

  const selectedAssetDetails = useAppSelector(selectSelectedAssetDetails);
  const selectedAssetNetwork = useAppSelector(selectBlockchainNetwork);
  const selectedAsset = useAppSelector(selectSelectedAsset);
  const depositAddress = useAppSelector(selectCryptoDepositAddress);

  const handleAddNewAddress = () => {
    dispatch(openBackdrop(Backdrops.REQUEST_WHITELIST_ADDRESS));
  };

  const requestedAmount = formik.values.amount;
  const isFormValidToDisplay =
    requestedAmount > 0 && formik.values.walletAddress && !formik.errors.amount;

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

  return {
    selectedAsset,
    selectedAssetDetails,
    selectedAssetNetwork,
    depositAddress,
    withdrawalDetails,
    handleAddNewAddress,
  };
};
