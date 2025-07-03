import { useEffect } from "react";
import { useTranslation } from "next-i18next";

import { useAppDispatch } from "@/store";
import { addFixedSnackbar, hideFixedSnackbar } from "@/store/notifications";
import { changeOfflineStatus } from "@/store/ui";

const namespace = "common";

export const useDetectNetworkError = () => {
  const { t } = useTranslation(namespace);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleOffline = () => {
      dispatch(
        addFixedSnackbar({
          id: 0,
          text: t(`${namespace}:offline`),
          error: true,
        })
      );
      dispatch(changeOfflineStatus(true));
    };

    const handleOnline = () => {
      dispatch(hideFixedSnackbar());
      dispatch(changeOfflineStatus(false));
      window.location.reload();
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);
};
