import { useEffect } from "react";
import { useTranslation } from "next-i18next";

import { Backdrops } from "@/definitions/types";
import { subscribeCryptoWithdrawalAddressess } from "@/services/wallet";
import { useAppDispatch, useAppSelector } from "@/store";
import { openBackdrop, setParameters } from "@/store/backdrops";
import { selectWalletPageSize } from "@/store/ui/ui.selectors";
import { changeWalletPageSize } from "@/store/ui/ui.store";
import { selectRawCryptoWithdrawalAddresses } from "@/store/wallet/wallet.selectors";

import { createColumnConfig, namespace } from "./config";

export const useAddresses = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(namespace);
  const columnConfig = createColumnConfig(t);

  const dataProvider = useAppSelector(selectRawCryptoWithdrawalAddresses);
  const listLength = useAppSelector(selectWalletPageSize);

  const handleNewAddress = () => {
    dispatch(openBackdrop(Backdrops.REQUEST_WHITELIST_ADDRESS));
  };

  const handleCellClicked = (row: any) => {
    dispatch(setParameters(row));
    dispatch(openBackdrop(Backdrops.DELETE_ADDRESS));
  };

  useEffect(() => {
    const cryptoWithdrawalsAddressess = dispatch(
      subscribeCryptoWithdrawalAddressess()
    );

    return () => {
      cryptoWithdrawalsAddressess.unsubscribe();
    };
  }, []);

  const handlePageSizeChange = (pageSize: unknown) => {
    dispatch(changeWalletPageSize(pageSize as number));
  };

  return {
    dataProvider,
    columnConfig,
    listLength,
    handlePageSizeChange,
    handleNewAddress,
    handleCellClicked,
  };
};
