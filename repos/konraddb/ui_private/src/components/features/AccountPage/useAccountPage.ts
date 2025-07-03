import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { AppRoutes } from "@/definitions/config";
import { AccountPageTabs } from "@/definitions/types";
import { useEnterRouteEffect } from "@/hooks/router";
import { getCustomer } from "@/services/account";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser, selectNeutralCustomerCode } from "@/store/account";
import {
  selectIsPendingVerification,
  selectIsValidLogin,
} from "@/store/auth/auth.selectors";
import { selectActiveAccountTab, setActiveAccountTab } from "@/store/ui";

import { createAccountSidenavConfig, namespace } from "./config";

export const useAccountPage = () => {
  const { t } = useTranslation(namespace);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector(selectIsAdminUser);
  const sidenavContent = createAccountSidenavConfig(t);
  const isValidLogin = useAppSelector(selectIsValidLogin);
  const selectedTab = useAppSelector(selectActiveAccountTab);
  const neutralCustomerCode = useAppSelector(selectNeutralCustomerCode);
  const isPendingVerification = useAppSelector(selectIsPendingVerification);

  const setSelectedTab = (tab: AccountPageTabs) => {
    dispatch(setActiveAccountTab(tab));
  };

  useEffect(() => {
    if (!isValidLogin && !isPendingVerification) {
      router.push(AppRoutes.HOME);
    }

    // TODO: Uncomment this when we have the API tokens ready
    // dispatch(getApiTokens());
  }, [isValidLogin, isPendingVerification, dispatch, router]);

  useEffect(() => {
    if (!neutralCustomerCode) return;

    dispatch(getCustomer(neutralCustomerCode));
  }, [neutralCustomerCode, dispatch]);

  useEnterRouteEffect(() => {
    dispatch(setActiveAccountTab(AccountPageTabs.profile));
  });

  return {
    isValidLogin,
    sidenavContent,
    isAdmin,
    selectedTab,
    setSelectedTab,
  };
};
