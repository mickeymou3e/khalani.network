import { useEffect } from "react";
import { Slide, toast,ToastContainer } from "react-toastify";

import { Snackbar } from "@/components/molecules";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectSnackbar } from "@/store/notifications/notifications.selectors";
import { hideSnackbar } from "@/store/notifications/notifications.store";

import {
  mainSnackbarContainerStyle,
  snackbarBodyStyle,
  snackbarStyle,
} from "./SnackbarContainers.styles";
import { SnackbarContainerId } from "./types";

const MainSnackbarContainer = () => {
  const dispatch = useAppDispatch();
  const snackbar = useAppSelector(selectSnackbar);

  useEffect(() => {
    if (!snackbar.primaryText) return;

    toast(<Snackbar {...snackbar} />, {
      toastId: snackbar.id,
      containerId: SnackbarContainerId.MAIN,
    });
    dispatch(hideSnackbar());
  }, [snackbar]);

  return (
    <ToastContainer
      containerId={SnackbarContainerId.MAIN}
      style={mainSnackbarContainerStyle}
      toastStyle={snackbarStyle}
      bodyStyle={snackbarBodyStyle}
      transition={Slide}
      position="top-right"
      hideProgressBar
      newestOnTop={false}
      autoClose={8000}
      closeOnClick={false}
      draggable={false}
      pauseOnHover
      enableMultiContainer
      pauseOnFocusLoss={false}
      closeButton={false}
    />
  );
};

export default MainSnackbarContainer;
