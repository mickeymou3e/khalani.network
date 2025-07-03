import { useEffect } from "react";
import { useTranslation } from "next-i18next";

import { Button } from "@/components/atoms";
import { Backdrops, Notifications } from "@/definitions/types";
import { useLeaveRouteEffect } from "@/hooks/router";
import { selectNeutralLoginError } from "@/services/auth/auth.api";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsNeutralAuthenticated } from "@/store/auth";
import { openBackdrop } from "@/store/backdrops";
import { addNotification, hideNotification } from "@/store/notifications";

const namespace = "common:notifications";

export const useUnavailableFeatureNotification = (available: boolean) => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();
  const isNeutralLoggedIn = useAppSelector(selectIsNeutralAuthenticated);
  const isNeutralLoginError = useAppSelector(selectNeutralLoginError);

  const unavailableText = t(`${namespace}:unavailableFeature`);
  const buttonText = t(`${namespace}:contact`);

  const handleContactClick = () => {
    dispatch(openBackdrop(Backdrops.CONTACT_US));
  };

  useEffect(() => {
    if ((!isNeutralLoggedIn && !isNeutralLoginError) || available) return;

    dispatch(
      addNotification({
        text: unavailableText,
        variant: "error",
        id: Notifications.UnavailableFeature,
        customChildren: (
          <Button variant="contained" size="small" onClick={handleContactClick}>
            {buttonText}
          </Button>
        ),
      })
    );
  }, [isNeutralLoggedIn, isNeutralLoginError, available]);

  useLeaveRouteEffect(() => {
    dispatch(hideNotification(Notifications.UnavailableFeature));
  });
};
