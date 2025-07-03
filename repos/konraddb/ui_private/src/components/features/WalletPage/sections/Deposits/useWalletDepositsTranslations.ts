import { useTranslation } from "next-i18next";

import { useAppSelector } from "@/store";
import { selectNeutralCustomerCode } from "@/store/account";

export const useWalletDepositsTranslations = (namespace: string) => {
  const { t } = useTranslation(namespace);

  const customerCode = useAppSelector(selectNeutralCustomerCode);

  return {
    t,
    wallet: t(`${namespace}:wallet`),
    pageTitle: t(`${namespace}:pageTitle`),
    yourDeposit: t(`${namespace}:yourDeposit`),
    pageTitleDescription: t(`${namespace}:pageTitleDescription`),
    newWallet: t(`${namespace}:newWallet`),
    balance: t(`${namespace}:balance`),
    selectOption: t(`${namespace}:selectOption`),
    chooseOptionToReveal: t(`${namespace}:chooseOptionToReveal`),
    network: t(`${namespace}:network`),

    summary: t(`${namespace}:summary`),
    cryptoDepositAddressLabel: t(`${namespace}:depositAddress`),
    copy: t(`${namespace}:copy`),
    cryptoSummaryDisclaimer: t(`${namespace}:cryptoSummaryDisclaimer`),
    assureSelectedNetwork: t(`${namespace}:assureSelectedNetwork`),
    copied: t(`${namespace}:copied`),
    createWallet: t(`${namespace}:createWallet`),

    accountType: t(`${namespace}:accountType`),
    accountNumber: t(`${namespace}:accountNumber`),
    referenceNumber: t(`${namespace}:referenceNumber`),
    referenceCode: t(`${namespace}:referenceCode`),
    accountHolder: t(`${namespace}:accountHolder`),
    bankName: t(`${namespace}:bankName`),
    bankAddress: t(`${namespace}:bankAddress`),
    routingCode: t(`${namespace}:routingCode`),
    swiftCode: t(`${namespace}:swiftCode`),
    ibanCode: t(`${namespace}:ibanCode`),
    fiatSummaryDisclaimer: t(`${namespace}:fiatSummaryDisclaimer`, {
      returnObjects: true,
    }) as string[],

    depositHistory: t(`${namespace}:depositHistory`),
    search: t(`${namespace}:search`),
    noHistoryYet: t(`${namespace}:noHistoryYet`),
    resultsNotFound: t(`${namespace}:resultsNotFound`),
    verifyAccount: t(`${namespace}:verifyAccount`),
    verify: t(`${namespace}:verify`),

    amount: t(`${namespace}:amount`),
    transactionId: t(`${namespace}:transactionId`),
    proofOfTransfer: t(`${namespace}:proofOfTransfer`),
    supportedFiles: t(`${namespace}:supportedFiles`),
    upload: t(`${namespace}:upload`),

    depositDetailSubmitted: t(`${namespace}:depositDetailSubmitted`),
    backToDeposit: t(`${namespace}:backToDeposit`),
    goToHome: t(`${namespace}:goToHome`),

    transferInstructions: t(`${namespace}:transferInstructions`),
    transferInstructionsMessage1: t(
      `${namespace}:transferInstructionsMessage1`
    ),
    transferInstructionsMessage2: t(
      `${namespace}:transferInstructionsMessage2`,
      {
        customer_code: customerCode,
      }
    ),
    transferInstructionsMessage3: t(
      `${namespace}:transferInstructionsMessage3`
    ),
    transferInstructionsMessage4: t(
      `${namespace}:transferInstructionsMessage4`
    ),
    scanQrCode: t(`${namespace}:scanQrCode`),
    createWalletToReveal: t(`${namespace}:createWalletToReveal`),
    createWalletLabel: t(`${namespace}:create`),
    addressNotExist: t(`${namespace}:addressNotExist`),
  };
};
