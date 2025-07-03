import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { AppRoutes } from "@/definitions/config";
import { WalletPageTabs } from "@/definitions/types";
import { useAncillarySubscriptions } from "@/hooks/ancillary";
import { useEnterRouteEffect } from "@/hooks/router";
import { useStrategySubscription } from "@/hooks/strategy";
import { getCustomer } from "@/services/account";
import {
  getAvailableAssetsList,
  subscribeCryptoWithdrawalAddressess,
  subscribeDepositsHistory,
  subscribeWithdrawalsHistory,
} from "@/services/wallet";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser, selectNeutralCustomerCode } from "@/store/account";
import { selectIsValidLogin } from "@/store/auth";
import { selectIsPendingVerification } from "@/store/auth/auth.selectors";
import { selectActiveWalletTab } from "@/store/ui/ui.selectors";
import { setActiveWalletTab } from "@/store/ui/ui.store";
import { setSelectedAsset } from "@/store/wallet";

import { createWalletSidenavConfig, namespace } from "./config";

export const useWalletPage = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  useStrategySubscription();
  useAncillarySubscriptions();
  const sidenavContent = createWalletSidenavConfig(t);

  const router = useRouter();
  const isAdmin = useAppSelector(selectIsAdminUser);
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const isPendingVerification = useAppSelector(selectIsPendingVerification);
  const selectedTab = useAppSelector(selectActiveWalletTab);
  const neutralCustomerCode = useAppSelector(selectNeutralCustomerCode);

  const setSelectedTab = (value: WalletPageTabs) => {
    dispatch(setActiveWalletTab(value));
    dispatch(setSelectedAsset(""));
  };

  useEffect(() => {
    if (!isLoggedIn && !isPendingVerification) {
      router.push(AppRoutes.HOME);
    }
  }, [isLoggedIn, isPendingVerification]);

  useEffect(() => {
    if (!neutralCustomerCode) return;

    dispatch(getCustomer(neutralCustomerCode));
  }, [neutralCustomerCode, dispatch]);

  useEffect(() => {
    dispatch(getAvailableAssetsList());

    const cryptoWithdrawalsAddressess = dispatch(
      subscribeCryptoWithdrawalAddressess()
    );
    const withdrawalsHistory = dispatch(subscribeWithdrawalsHistory());
    const depositsHistory = dispatch(subscribeDepositsHistory());

    return () => {
      cryptoWithdrawalsAddressess.unsubscribe();
      withdrawalsHistory.unsubscribe();
      depositsHistory.unsubscribe();
    };
  }, []);

  useEnterRouteEffect(() => {
    dispatch(setActiveWalletTab(WalletPageTabs.portfolio));
    dispatch(setSelectedAsset(""));
  });

  return {
    isLoggedIn,
    sidenavContent,
    isAdmin,
    selectedTab,
    setSelectedTab,
  };
};
