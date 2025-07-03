import { FormikProps } from "formik";

import { AddressState, FiatCurrencies } from "@/definitions/types";
import { selectCustomer } from "@/services/account";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectSelectedAssetAvailableWithdrawalBalance } from "@/store/balances/balances.selectors";
import {
  selectCryptoWithdrawalAddresses,
  selectIsAssetFiat,
  setSelectedAssetDetails,
} from "@/store/wallet";
import { selectRawCryptoWithdrawalAddresses } from "@/store/wallet/wallet.selectors";

interface UseWithdrawalsSelectorsProps {
  formik: FormikProps<any>;
}

export const useWithdrawalsSelectors = ({
  formik,
}: UseWithdrawalsSelectorsProps) => {
  const dispatch = useAppDispatch();

  const selectedAssetBalance = useAppSelector(
    selectSelectedAssetAvailableWithdrawalBalance
  );
  const isFiat = useAppSelector(selectIsAssetFiat);
  const rawWithdrawalsAddresses = useAppSelector(
    selectRawCryptoWithdrawalAddresses
  );
  const withdrawalsAddresses = useAppSelector(selectCryptoWithdrawalAddresses);
  const neutralCustomer = useAppSelector(selectCustomer);

  const checkIsFiatAddress = () => {
    const result = neutralCustomer?.ibans.find(
      (iban) => iban.currency === FiatCurrencies.EUR
    );
    return result || null;
  };

  const isAddressExists = isFiat
    ? checkIsFiatAddress()
    : withdrawalsAddresses.length > 0;

  const handleSelectAccount = (value: any) => {
    formik.setFieldValue("walletAddress", value);
    const selectedAssetDetails = rawWithdrawalsAddresses.find(
      (asset) => `${asset.label}-${asset.address}` === value
    );
    const modifiedAssetDetails = {
      ...selectedAssetDetails,
      currency: selectedAssetDetails?.currency.toUpperCase(),
    };
    formik.setFieldValue(
      "isAddressValid",
      selectedAssetDetails?.state === AddressState.approved
    );
    if (selectedAssetDetails) {
      dispatch(setSelectedAssetDetails(modifiedAssetDetails));
    }
  };

  const handleUseMaxAmount = () => {
    formik.setFieldValue("amount", selectedAssetBalance?.assetBalanceValue);
  };

  return {
    selectedAssetBalance,
    isFiat,
    withdrawalsAddresses,
    isAddressExists,
    handleUseMaxAmount,
    handleSelectAccount,
  };
};
