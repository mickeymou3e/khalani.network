import { useEffect } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";

import { Notification } from "@/components/molecules";
import { useAppSelector } from "@/store";
import { selectNotifications } from "@/store/notifications";

import {
  fixedSnackbarContainerStyle,
  snackbarBodyStyle,
  snackbarStyle,
} from "./SnackbarContainers.styles";
import { SnackbarContainerId } from "./types";

const NotificationContainer = () => {
  const notifications = useAppSelector(selectNotifications);

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!notification.primaryText) {
        toast.dismiss(notification.id);
        return;
      }

      toast(<Notification {...notification} />, {
        toastId: notification.id,
        autoClose: false,
        containerId: SnackbarContainerId.NOTIFICATION,
      });
    });
  }, [notifications]);

  return (
    <ToastContainer
      containerId={SnackbarContainerId.NOTIFICATION}
      style={fixedSnackbarContainerStyle(true)}
      toastStyle={snackbarStyle}
      bodyStyle={snackbarBodyStyle}
      transition={Slide}
      position="top-right"
      hideProgressBar
      newestOnTop={false}
      autoClose={false}
      closeOnClick={false}
      draggable={false}
      enableMultiContainer
      pauseOnFocusLoss={false}
      closeButton={false}
    />
  );
};

export default NotificationContainer;
