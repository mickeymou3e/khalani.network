import { useState } from "react";
import * as dateFns from "date-fns";
import { useTranslation } from "next-i18next";

import { selectUserProfile } from "@/services/account/account.api";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsAdminUser } from "@/store/account";
import { selectHideAccountValues } from "@/store/ui/ui.selectors";
import { changeHideAccountValues } from "@/store/ui/ui.store";
import formatAddress from "@/utils/formatAddress";
import { createAsterisks } from "@/utils/formatters";

import { namespace } from "../../config";

export const useUserInformation = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(selectUserProfile);
  const hideValues = useAppSelector(selectHideAccountValues);
  const isAdmin = useAppSelector(selectIsAdminUser);
  const asterisks = createAsterisks();

  // TODO: check for status on component load when API is ready
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(false);

  const administratorLabel = hideValues
    ? asterisks
    : t(`${namespace}:administrator`);
  const traderLabel = hideValues ? asterisks : t(`${namespace}:trader`);
  const uploadLabel = t(`${namespace}:upload`);
  const removeLabel = t(`${namespace}:remove`);
  const receiveEmailsLabel = t(`${namespace}:receiveEmails`);

  const clientCode = hideValues
    ? asterisks
    : formatAddress(userProfile?.client.code);
  const idLabel = t(`${namespace}:id`, {
    value: clientCode,
  });
  const formattedDate = hideValues
    ? asterisks
    : dateFns.format(new Date(userProfile!.registration_date), "MMMM Lo yyyy");
  const joinedLabel = `${t(`${namespace}:joined`, {
    value: formattedDate,
  })}`;
  const name = hideValues ? asterisks : userProfile?.name;
  const email = hideValues ? asterisks : userProfile?.display_name;

  const handleVisibility = () => {
    dispatch(changeHideAccountValues(!hideValues));
  };

  const handleChangeEmailNotifications = () => {
    setEmailNotificationsEnabled(!emailNotificationsEnabled);
  };

  const handleUploadImage = () => {
    console.log("upload image");
  };

  const handleRemoveImage = () => {
    console.log("remove image");
  };

  return {
    isAdmin,
    administratorLabel,
    traderLabel,
    uploadLabel,
    removeLabel,
    receiveEmailsLabel,
    idLabel,
    joinedLabel,
    name,
    email,
    emailNotificationsEnabled,
    handleVisibility,
    handleChangeEmailNotifications,
    handleUploadImage,
    handleRemoveImage,
  };
};
