import { useTranslation } from "next-i18next";

export const useTranslations = (namespace: string) => {
  const { t } = useTranslation(namespace);

  return {
    t,
    currency: t(`${namespace}:currency`),
    selectOption: t(`${namespace}:selectOption`),
    verify: t(`${namespace}:verify`),

    // Main view
    addnewWalletAddress: t(`${namespace}:addnewWalletAddress`),
    addnewWalletAddressMessageEmail: t(
      `${namespace}:addnewWalletAddressMessageEmail`
    ),
    asset: t(`${namespace}:asset`),
    address: t(`${namespace}:address`),
    withdrawalAddress: t(`${namespace}:withdrawalAddress`),
    typeWithdrawalAddress: t(`${namespace}:typeWithdrawalAddress`),
    labelPlaceholder: t(`${namespace}:labelPlaceholder`),
    whitelistAddress: t(`${namespace}:whitelistAddress`),
    whitelistAddressMessage1: t(`${namespace}:whitelistAddressMessage1`),
    whitelistAddressMessage2: t(`${namespace}:whitelistAddressMessage2`),
    next: t(`${namespace}:next`),
    cancel: t(`${namespace}:cancel`),

    // Verify view
    verifyViewTitle: t(`${namespace}:verifyViewTitle`),
    verifyViewSubtitle: t(`${namespace}:verifyViewSubtitle`),
    verifyViewPrimaryButton: t(`${namespace}:verify`),

    // Success view
    successViewTitle: t(`${namespace}:successViewTitle`),
    successViewSubtitle: t(`${namespace}:successViewSubtitle`),
    successViewPrimaryButton: t(`${namespace}:successViewPrimaryButton`),

    // Error view
    errorViewTitle: t(`${namespace}:errorViewTitle`),
    errorViewSubtitle: t(`${namespace}:errorViewSubtitle`),
    errorViewPrimaryButton: t(`${namespace}:errorViewPrimaryButton`),
  };
};
