import { useEffect } from "react";
import { useTranslation } from "next-i18next";

import { Notifications } from "@/definitions/types";
import { useLoggedOutEffect } from "@/hooks/account";
import { useAncillarySubscriptions } from "@/hooks/ancillary";
import { useUnavailableFeatureNotification } from "@/hooks/notifications";
import { useEnterRouteEffect, useLeaveRouteEffect } from "@/hooks/router";
import { useStrategySubscription } from "@/hooks/strategy";
import { getCustomer } from "@/services/account";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser, selectNeutralCustomerCode } from "@/store/account";
import {
  selectIsNeutralAuthenticated,
  selectIsValidLogin,
  selectNeutralFeatures,
} from "@/store/auth";
import { addNotification, hideNotification } from "@/store/notifications";

import { BridgeMode } from "./BridgePage.types";
import { namespace } from "./config";
import {
  backToDefault,
  changeMode,
  resetSelection,
  selectBridgeMode,
  subscribeBridgeHistory,
  subscribeBridgeRequests,
} from "./store";

const useBridgePage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { strategyCode } = useStrategySubscription();
  useAncillarySubscriptions();
  const mode = useAppSelector(selectBridgeMode);
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const isAdmin = useAppSelector(selectIsAdminUser);
  const neutralCustomerCode = useAppSelector(selectNeutralCustomerCode);
  const isNeutralAuthenticated = useAppSelector(selectIsNeutralAuthenticated);
  const featureFlags = useAppSelector(selectNeutralFeatures);
  useUnavailableFeatureNotification(featureFlags.bridge);
  const isBridgeIn = mode === BridgeMode.In;

  const title = t(`${namespace}:pageTitle`);
  const description = t(`${namespace}:pageDescription`)!;
  const nonAdminMessage = t(`${namespace}:nonAdminMessage`);

  const modes = Object.values(BridgeMode).map((mode) => ({
    label: t(`${namespace}:modes:${mode}`),
    value: mode,
  }));

  const handleModeChange = (mode: BridgeMode) => {
    if (!mode) return;

    dispatch(changeMode(mode));
    dispatch(resetSelection());
  };

  useEffect(() => {
    if (!isLoggedIn || isAdmin) {
      dispatch(hideNotification(Notifications.NonAdmin));
      return;
    }

    dispatch(
      addNotification({
        text: nonAdminMessage,
        variant: "info",
        id: Notifications.NonAdmin,
      })
    );
  }, [isAdmin, isLoggedIn]);

  useEffect(() => {
    if (!neutralCustomerCode) return;

    dispatch(getCustomer(neutralCustomerCode));
  }, [neutralCustomerCode, dispatch]);

  useEffect(() => {
    if (!strategyCode || !isNeutralAuthenticated) return;

    const bridgeRequestsSubscription = dispatch(subscribeBridgeRequests());
    const bridgeHistorySubscription = dispatch(subscribeBridgeHistory());

    return () => {
      bridgeRequestsSubscription.unsubscribe();
      bridgeHistorySubscription.unsubscribe();
    };
  }, [strategyCode, isNeutralAuthenticated]);

  useEnterRouteEffect(() => {
    dispatch(backToDefault());
  });

  useLeaveRouteEffect(() => dispatch(hideNotification(Notifications.NonAdmin)));

  useLoggedOutEffect(() => dispatch(resetSelection()));

  return {
    title,
    description,
    modes,
    mode,
    isBridgeIn,
    handleModeChange,
  };
};

export default useBridgePage;
