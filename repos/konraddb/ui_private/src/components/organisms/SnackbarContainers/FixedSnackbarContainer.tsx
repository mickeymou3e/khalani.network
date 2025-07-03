import { useEffect } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";

import { FixedSnackbar } from "@/components/molecules";
import { useAppSelector } from "@/store";
import { selectFixedSnackbar } from "@/store/notifications/notifications.selectors";

import {
  fixedSnackbarContainerStyle,
  snackbarBodyStyle,
  snackbarStyle,
} from "./SnackbarContainers.styles";
import { SnackbarContainerId } from "./types";

const FixedSnackbarContainer = () => {
  const snackbar = useAppSelector(selectFixedSnackbar);

  useEffect(() => {
    if (!snackbar.text) {
      toast.dismiss(snackbar.id);
      return;
    }

    toast(<FixedSnackbar {...snackbar} />, {
      toastId: snackbar.id,
      autoClose: false,
      containerId: SnackbarContainerId.FIXED,
    });
  }, [snackbar]);

  return (
    <ToastContainer
      containerId={SnackbarContainerId.FIXED}
      style={fixedSnackbarContainerStyle(snackbar.error)}
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

export default FixedSnackbarContainer;
