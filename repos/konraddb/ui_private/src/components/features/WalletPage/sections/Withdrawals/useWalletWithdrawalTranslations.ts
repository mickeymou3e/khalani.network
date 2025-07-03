import { useTranslation } from "next-i18next";

export const useWalletWithdrawalTranslations = (namespace: string) => {
  const { t } = useTranslation(namespace);

  return {
    t,
    wallet: t(`${namespace}:wallet`),
    pageTitle: t(`${namespace}:pageTitle`),
    pageTitleDescription: t(`${namespace}:pageTitleDescription`),
    newWallet: t(`${namespace}:newWallet`),

    // /Asset Selector
    yourWithdraw: t(`${namespace}:yourWithdraw`),
    available: t(`${namespace}:available`),
    infoText: t(`${namespace}:info`),
    selectOption: t(`${namespace}:selectOption`),
    selectAddress: t(`${namespace}:selectAddress`),
    selectFee: t(`${namespace}:selectFee`),
    chooseOptionToReveal: t(`${namespace}:chooseOptionToReveal`),
    balanceDisclaimer: t(`${namespace}:balanceDisclaimer`),
    walletAddress: t(`${namespace}:walletAddress`),
    typeWalletAddress: t(`${namespace}:typeWalletAddress`),
    amount: t(`${namespace}:amount`),
    dailyLimit: t(`${namespace}:dailyLimit`),
    max: t(`${namespace}:max`),
    whitelisted: t(`${namespace}:whitelisted`),
    bankAccount: t(`${namespace}:bankAccount`),

    // Crypto Withdrawal Summary
    summary: t(`${namespace}:summary`),
    withdrawAddress: t(`${namespace}:withdrawAddress`),
    add: t(`${namespace}:add`),
    reviewWithdraw: t(`${namespace}:reviewWithdraw`),
    reviewWithdrawMessage: t(`${namespace}:reviewWithdrawMessage`),
    network: t(`${namespace}:network`),
    confirmations: t(`${namespace}:confirmations`),
    fees: t(`${namespace}:fees`),
    youWillReceive: t(`${namespace}:youWillReceive`),
    requestWithdrawal: t(`${namespace}:requestWithdrawal`),
    copyAddress: t(`${namespace}:copyAddress`),
    cryptoSummaryDisclaimer: t(`${namespace}:cryptoSummaryDisclaimer`),
    cryptoSummaryDisclaimerBold: t(`${namespace}:cryptoSummaryDisclaimerBold`),

    // Fiat Withdrawal Summary
    bankToBeWithdrawn: t(`${namespace}:bankToBeWithdrawn`),
    withdrawnInfo: t(`${namespace}:withdrawnInfo`),
    holder: t(`${namespace}:holder`),
    yourAccount: t(`${namespace}:yourAccount`),
    accountNumber: t(`${namespace}:accountNumber`),
    accountType: t(`${namespace}:accountType`),
    routingCode: t(`${namespace}:routingCode`),
    swiftCode: t(`${namespace}:swiftCode`),
    location: t(`${namespace}:location`),
    fiatSummaryDisclaimer: t(`${namespace}:fiatSummaryDisclaimer`, {
      returnObjects: true,
    }) as string[],

    // Withdrawal History
    withdrawHistory: t(`${namespace}:withdrawHistory`),
    search: t(`${namespace}:search`),
    date: t(`${namespace}:date`),
    type: t(`${namespace}:type`),
    tx: t(`${namespace}:tx`),
    fee: t(`${namespace}:fee`),
    status: t(`${namespace}:status`),
    noHistoryYet: t(`${namespace}:noHistoryYet`),
    resultsNotFound: t(`${namespace}:resultsNotFound`),
    verifyAccount: t(`${namespace}:verifyAccount`),
    verify: t(`${namespace}:verify`),
  };
};
