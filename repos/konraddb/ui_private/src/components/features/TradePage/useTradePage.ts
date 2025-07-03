import { useEffect } from "react";
import { useRouter } from "next/router";

import { subscribeOrders } from "@/services/orders";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin } from "@/store/auth";
import { changeSelectedAsset } from "@/store/ui";

export const useTradePage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const selectedAsset = (router.query?.asset as string) || null;

  useEffect(() => {
    if (!selectedAsset) return undefined;

    const [base, quote] = selectedAsset.split("_");
    dispatch(changeSelectedAsset({ base, quote }));
  }, [dispatch, selectedAsset]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const ordersSubscription = dispatch(subscribeOrders());

    return () => {
      ordersSubscription.unsubscribe();
    };
  }, [dispatch, isLoggedIn]);
};
