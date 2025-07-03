import { useEffect, useState } from "react";

import {
  AssetConfigEntry,
  AssetName,
  getAssetDetails,
} from "@/definitions/config";
import { RequestStatusProps } from "@/definitions/types";
import { subscribeBalances } from "@/services/balances";
import {
  createWallet,
  CryptoDepositWalletsProps,
  getCryptoDepositsAddressess,
  subscribeCryptoDepositsAddressess,
} from "@/services/wallet";
import { store, useAppDispatch, useAppSelector } from "@/store";
import {
  selectNeutralClientCode,
  selectNeutralCustomerCode,
} from "@/store/account";
import { selectSelectedStrategyCode } from "@/store/ancillary";
import { selectIsNeutralAuthenticated } from "@/store/auth";
import {
  selectFetchCryptoDepositAddressesStatus,
  selectRawCryptoDepositAddresses,
} from "@/store/wallet";

const searchWallet = (wallets: CryptoDepositWalletsProps[], label: string) =>
  wallets.find((wallet) => wallet.label === label);

const createNewWallet = async (
  assetConfig: AssetConfigEntry,
  customerCode: string,
  feeSourceWalletCode?: string
) => {
  const values = {
    currency_code: assetConfig.code,
    fee_source_wallet_code: feeSourceWalletCode ?? "",
    customer_code: customerCode,
    label: assetConfig.walletLabel,
    accounting_type: assetConfig.accountingType,
  };

  const result = await store.dispatch(createWallet(values));

  return "data" in result ? result.data : null;
};

const createMaticWallet = async (
  cryptoWallets: CryptoDepositWalletsProps[],
  customerCode: string
) => {
  const maticAsset = getAssetDetails(AssetName.MATIC_POLYGON);
  const maticWallet = searchWallet(cryptoWallets, maticAsset.walletLabel);

  if (maticWallet) return maticWallet;

  const createdWallet = await createNewWallet(maticAsset, customerCode);

  return createdWallet;
};

const manageCryptoWallets = async (
  cryptoWallets: CryptoDepositWalletsProps[],
  clientCode: string,
  customerCode: string
) => {
  const poolToken = process.env.NEXT_PUBLIC_POOL_TOKEN as string;
  const jltAsset = getAssetDetails(poolToken);
  const jltWallet = searchWallet(cryptoWallets, jltAsset.walletLabel);

  if (jltWallet) return false;

  const createdMaticWallet = await createMaticWallet(
    cryptoWallets,
    customerCode
  );

  await createNewWallet(jltAsset, customerCode, createdMaticWallet?.code);

  store.dispatch(getCryptoDepositsAddressess(clientCode));

  return true;
};

export const useWalletSubscriptions = () => {
  const dispatch = useAppDispatch();
  const neutralClientCode = useAppSelector(selectNeutralClientCode);
  const customerCode = useAppSelector(selectNeutralCustomerCode);

  useEffect(() => {
    if (!neutralClientCode || !customerCode) return;

    const cryptoDepositsAddressess = dispatch(
      subscribeCryptoDepositsAddressess(neutralClientCode)
    );
    const balancesSubscription = dispatch(subscribeBalances(customerCode));

    return () => {
      cryptoDepositsAddressess.unsubscribe();
      balancesSubscription.unsubscribe();
    };
  }, [neutralClientCode, customerCode]);
};

export const useWalletCreation = () => {
  const [hasCreatedWallet, setHasCreatedWallet] = useState(false);
  const neutralClientCode = useAppSelector(selectNeutralClientCode);
  const customerCode = useAppSelector(selectNeutralCustomerCode);
  const cryptoDepositAddressesStatus = useAppSelector(
    selectFetchCryptoDepositAddressesStatus
  );
  const walletAddresses = useAppSelector(selectRawCryptoDepositAddresses);
  const strategyCode = useAppSelector(selectSelectedStrategyCode);
  const isNeutralAuthenticated = useAppSelector(selectIsNeutralAuthenticated);
  const isInvalid =
    cryptoDepositAddressesStatus !== RequestStatusProps.SUCCESS ||
    !strategyCode ||
    !neutralClientCode ||
    hasCreatedWallet ||
    !isNeutralAuthenticated;

  useEffect(() => {
    if (isInvalid) return;

    const executeManageWallets = async () => {
      const isCreated = await manageCryptoWallets(
        walletAddresses,
        neutralClientCode,
        customerCode
      );
      setHasCreatedWallet(isCreated);
    };

    executeManageWallets();
  }, [isInvalid, walletAddresses, neutralClientCode, customerCode]);
};
