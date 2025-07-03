import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { AppRoutes } from "@/definitions/config";
import { Backdrops } from "@/definitions/types";
import { useAppDispatch } from "@/store";
import { openBackdrop } from "@/store/backdrops";

import { namespace } from "../config";

export const useCompletedView = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const accountCreatedTitle = t(`${namespace}:accountCreatedTitle`);
  const accountCreatedSubtitle = t(`${namespace}:accountCreatedSubtitle`);
  const loginButtonText = t(`${namespace}:login`);

  const handleGoToLogin = async () => {
    await router.push(AppRoutes.MARKETS);
    dispatch(openBackdrop(Backdrops.LOGIN));
  };

  return {
    accountCreatedTitle,
    accountCreatedSubtitle,
    loginButtonText,
    handleGoToLogin,
  };
};
