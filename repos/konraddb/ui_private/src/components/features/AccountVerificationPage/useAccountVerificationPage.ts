import { useRouter } from "next/router";

import { AppRoutes } from "@/definitions/config";
import { Backdrops } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin } from "@/store/auth";
import { openBackdrop } from "@/store/backdrops/backdrops.store";

export const useAccountVerificationPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isLoggedIn = useAppSelector(selectIsValidLogin);

  const [verifyAccount] = [() => {}];

  const handleLogin = () => {
    router.push(AppRoutes.MARKETS);
    dispatch(openBackdrop(Backdrops.LOGIN));
  };

  const handleGoHome = () => {
    router.push(AppRoutes.MARKETS);
  };

  return { verifyAccount, handleLogin, handleGoHome, isLoggedIn };
};
