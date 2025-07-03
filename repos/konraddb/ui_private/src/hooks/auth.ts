import { useEffect } from "react";

import { getUserProfile } from "@/services/account";
import { neutralLogin, subscribeRenewToken } from "@/services/auth";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectNeutralUserCode } from "@/store/account";
import {
  selectIsNeutralAuthenticated,
  selectIsNotValidLogin,
  selectIsValidLogin,
} from "@/store/auth";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const isNotValidLogin = useAppSelector(selectIsNotValidLogin);
  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const userCode = useAppSelector(selectNeutralUserCode);
  const isNeutralAuthenticated = useAppSelector(selectIsNeutralAuthenticated);

  useEffect(() => {
    if (!isNotValidLogin) return;

    dispatch(getUserProfile());
  }, [dispatch, isNotValidLogin]);

  useEffect(() => {
    if (!isLoggedIn) return;

    dispatch(neutralLogin(userCode));
  }, [isLoggedIn, userCode]);

  useEffect(() => {
    if (!isNeutralAuthenticated) return;

    const renewTokenSubscription = dispatch(subscribeRenewToken());

    return () => {
      renewTokenSubscription.unsubscribe();
    };
  }, [isNeutralAuthenticated]);
};
