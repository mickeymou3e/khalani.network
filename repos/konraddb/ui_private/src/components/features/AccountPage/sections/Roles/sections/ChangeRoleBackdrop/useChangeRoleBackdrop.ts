import { useState } from "react";
import { useTranslation } from "next-i18next";

import { namespace } from "./config";

export enum ChangeRoleBackdroppViews {
  Main = "Main",
  Verify = "Verify",
  Success = "Success",
}

export const useChangeRoleBackdrop = () => {
  const { t } = useTranslation(namespace);

  const [view, setView] = useState(ChangeRoleBackdroppViews.Main);

  // TODO: delete it if it turns out to be unnecessary
  const setCredentials = (credentials: any) => {
    console.log(credentials);
  };

  return {
    view,
    setView,
    setCredentials,

    mainViewTitle: t(`${namespace}:mainViewTitle`),
    mainViewSubtitle: t(`${namespace}:mainViewSubtitle`),
    contentTitle: t(`${namespace}:contentTitle`),
    content1: t(`${namespace}:content1`),
    content2: t(`${namespace}:content2`),
    content3: t(`${namespace}:content3`),
    infoBox: t(`${namespace}:infoBox`),
    mainViewPrimaryButton: t(`${namespace}:mainViewPrimaryButton`),
    mainViewSecondaryButton1: t(`${namespace}:mainViewSecondaryButton1`),

    verifyViewTitle: t(`${namespace}:verifyViewTitle`),
    verifyViewSubtitle: t(`${namespace}:verifyViewSubtitle`),
    verifyViewPrimaryButton: t(`${namespace}:verifyViewPrimaryButton`),

    successViewTitle: t(`${namespace}:successViewTitle`),
    successViewSubtitle: t(`${namespace}:successViewSubtitle`),
    successViewPrimaryButton: t(`${namespace}:successViewPrimaryButton`),
  };
};
