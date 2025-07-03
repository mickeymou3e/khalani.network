import { useEffect } from "react";

import { TradedPair, tradedPairs } from "@/definitions/config";
import { getUsers } from "@/services/admin/admin.api";
import { AssignedAsset } from "@/services/assets";
import {
  getAssignedAssets,
  selectAssignedAssets,
} from "@/services/assets/assets.api";
import { subscribeNeutralRates, subscribeRates } from "@/services/rates";
import { socketClient } from "@/services/streaming";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectNeutralClientCode } from "@/store/account/account.selectors";
import {
  selectIsPendingVerification,
  selectIsValidLogin,
  selectWsToken,
} from "@/store/auth";

export const useWebsocketSubscriptions = () => {
  const dispatch = useAppDispatch();
  const isValidLogin = useAppSelector(selectIsValidLogin);
  const assets = useAppSelector(selectAssignedAssets);
  const wsToken = useAppSelector(selectWsToken);
  const neutralClientCode = useAppSelector(selectNeutralClientCode);

  useEffect(() => {
    if (!isValidLogin || !neutralClientCode || !wsToken) return;

    socketClient.authenticate(wsToken);
    dispatch(getUsers());

    dispatch(getAssignedAssets(neutralClientCode));
  }, [dispatch, isValidLogin, neutralClientCode, wsToken]);

  useEffect(() => {
    if (!isValidLogin || !assets || !neutralClientCode) return;

    const ratesSubscriptions = assets.map((asset: AssignedAsset) =>
      dispatch(subscribeRates(asset.pair!))
    );

    return () => {
      ratesSubscriptions.forEach((subscription: any) =>
        subscription.unsubscribe()
      );
    };
  }, [assets, isValidLogin, dispatch]);
};

export const useNeutralWebsocketSubscriptions = () => {
  const dispatch = useAppDispatch();
  const isValidLogin = useAppSelector(selectIsValidLogin);
  const isPendingLoginVerification = useAppSelector(
    selectIsPendingVerification
  );

  useEffect(() => {
    if (isValidLogin || isPendingLoginVerification) return;

    const ratesSubscriptions = tradedPairs.map((asset: TradedPair) =>
      dispatch(subscribeNeutralRates(asset.pair!))
    );

    return () => {
      ratesSubscriptions.forEach((subscription: any) =>
        subscription.unsubscribe()
      );
    };
  }, [isValidLogin, isPendingLoginVerification]);
};
