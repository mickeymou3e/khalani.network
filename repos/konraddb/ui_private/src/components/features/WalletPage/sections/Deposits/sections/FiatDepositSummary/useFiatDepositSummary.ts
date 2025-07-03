import { useTranslation } from "next-i18next";

import {
  FiatDepositAccounts,
  fiatDepositAccounts,
} from "@/definitions/banks/fiatDeposit";
import { Backdrops } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectNeutralCustomerCode } from "@/store/account";
import { openBackdrop } from "@/store/backdrops";
import { selectSelectedAsset } from "@/store/wallet";

import { namespace } from "../../config";

export const useFiatDepositSummary = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();

  const selectedAsset = useAppSelector(selectSelectedAsset);
  const customerCode = useAppSelector(selectNeutralCustomerCode);

  const fiatDepositAccount = fiatDepositAccounts.find(
    (item) => item.asset === selectedAsset
  ) as FiatDepositAccounts;

  const bankDetails = [
    {
      label: t(`${namespace}:referenceCode`),
      value: customerCode,
    },
    {
      label: t(`${namespace}:accountHolder`),
      value: fiatDepositAccount?.accountHolder,
    },
    {
      label: t(`${namespace}:bankName`),
      value: fiatDepositAccount?.bankName,
    },
    {
      label: t(`${namespace}:bankAddress`),
      value: fiatDepositAccount?.bankAddress,
    },
    {
      label: t(`${namespace}:swiftCode`),
      value: fiatDepositAccount?.swift_bicCode,
    },
  ];

  const handleOpenSupportModal = () => {
    dispatch(openBackdrop(Backdrops.CONTACT_US));
  };

  return {
    selectedAsset,
    fiatDepositAccount,
    bankDetails,
    handleOpenSupportModal,
  };
};
