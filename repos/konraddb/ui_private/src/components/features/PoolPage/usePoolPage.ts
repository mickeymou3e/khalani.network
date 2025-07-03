import { useEffect } from "react";
import { useTranslation } from "next-i18next";

import { useAncillarySubscriptions } from "@/hooks/ancillary";
import { useUnavailableFeatureNotification } from "@/hooks/notifications";
import { useEnterRouteEffect } from "@/hooks/router";
import { useStrategySubscription } from "@/hooks/strategy";
import { getAvailableAssetsList } from "@/services/wallet";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectJltTokenAddress } from "@/store/ancillary";
import { selectIsValidLogin, selectNeutralFeatures } from "@/store/auth";
import {
  backToDefault,
  modeChanged,
  PoolMode,
  PoolModes,
  resetSelection,
} from "@/store/pool";

import { namespace } from "./config";
import { subscribePoolHistory } from "./store/pool.api";
import { selectMode } from "./store/pool.selectors";

const usePoolPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useStrategySubscription();
  useAncillarySubscriptions();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const mode = useAppSelector(selectMode);
  const jltTokenAddress = useAppSelector(selectJltTokenAddress);
  const isDeposit = mode === PoolModes.Deposit;
  const featureFlags = useAppSelector(selectNeutralFeatures);
  useUnavailableFeatureNotification(featureFlags.pool || featureFlags.redeem);

  const handleModeChange = (mode: PoolMode) => {
    if (!mode) return;

    dispatch(modeChanged(mode));
    dispatch(resetSelection());
  };

  const poolModes = Object.values(PoolModes).map((mode) => ({
    label: t(`${namespace}:modes:${mode}`),
    value: mode,
  }));

  useEffect(() => {
    if (!isLoggedIn) return;

    dispatch(getAvailableAssetsList());
  }, [isLoggedIn]);

  useEffect(() => {
    if (!jltTokenAddress) return;

    const poolHistorySubscription = dispatch(
      subscribePoolHistory(jltTokenAddress)
    );

    return () => {
      poolHistorySubscription.unsubscribe();
    };
  }, [jltTokenAddress]);

  useEnterRouteEffect(() => {
    dispatch(backToDefault());
  });

  return {
    mode,
    modes: poolModes,
    isDeposit,
    handleModeChange,
  };
};

export default usePoolPage;
