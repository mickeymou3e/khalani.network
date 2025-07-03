import { useEffect } from "react";
import { useTranslation } from "next-i18next";

import { useAncillarySubscriptions } from "@/hooks/ancillary";
import { useUnavailableFeatureNotification } from "@/hooks/notifications";
import { useEnterRouteEffect } from "@/hooks/router";
import { useStrategySubscription } from "@/hooks/strategy";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectJltTokenAddress } from "@/store/ancillary";
import { selectNeutralFeatures } from "@/store/auth";

import { namespace } from "./config";
import { resetSelection } from "./store";
import { subscribeRetireHistory } from "./store/retire.api";

const useRetirePage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useStrategySubscription();
  useAncillarySubscriptions();
  const jltTokenAddress = useAppSelector(selectJltTokenAddress);
  const featureFlags = useAppSelector(selectNeutralFeatures);
  useUnavailableFeatureNotification(featureFlags.retire);
  const title = t(`${namespace}:pageTitle`);

  useEffect(() => {
    if (!jltTokenAddress) return;

    const retireHistorySubscription = dispatch(
      subscribeRetireHistory(jltTokenAddress)
    );

    return () => {
      retireHistorySubscription.unsubscribe();
    };
  }, [jltTokenAddress]);

  useEnterRouteEffect(() => {
    dispatch(resetSelection());
  });

  return {
    title,
  };
};

export default useRetirePage;
