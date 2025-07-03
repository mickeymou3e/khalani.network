import { useState } from "react";
import { useTranslation } from "next-i18next";

import { useAppDispatch } from "@/store";
import { hideBackdrop } from "@/store/backdrops";

import { namespace } from "./config";

export enum InviteUserBackdropViews {
  Main = "Main",
  Success = "Success",
  Error = "Error",
}

export const useInviteUserBackdrop = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(namespace);

  const [view, setView] = useState(InviteUserBackdropViews.Main);

  const handleCancelClick = () => {
    dispatch(hideBackdrop());
  };

  return {
    view,
    setView,
    handleCancelClick,

    mainViewTitle: t(`${namespace}:mainViewTitle`),
    mainViewSubtitle: t(`${namespace}:mainViewSubtitle`),
    email: t(`${namespace}:email`),
    role: t(`${namespace}:role`),
    admin: t(`${namespace}:admin`),
    trader: t(`${namespace}:trader`),
    mainViewPrimaryButton: t(`${namespace}:mainViewPrimaryButton`),
    mainViewSecondaryButton1: t(`${namespace}:mainViewSecondaryButton1`),

    successViewTitle: t(`${namespace}:successViewTitle`),
    successViewSubtitle: t(`${namespace}:successViewSubtitle`),
    successViewPrimaryButton: t(`${namespace}:successViewPrimaryButton`),

    errorViewTitle: t(`${namespace}:errorViewTitle`),
    errorViewSubtitle: t(`${namespace}:errorViewSubtitle`),
    errorViewPrimaryButton: t(`${namespace}:errorViewPrimaryButton`),
    errorViewSecondaryButton: t(`${namespace}:errorViewSecondaryButton`),
  };
};
