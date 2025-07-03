import { Modal } from "@/components/molecules";
import { ModalVariants } from "@/definitions/types";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectModalProps, setModalParams } from "@/store/ui";

import { BridgeFailedView, BridgeSuccessView, BridgingView } from "./views";

export enum BridgeModalViews {
  None = "None",
  BridgingIn = "BridgingIn",
  BridgingOut = "BridgingOut",
  BridgeInSuccess = "BridgeInSuccess",
  BridgeOutSuccess = "BridgeOutSuccess",
  BridgeFailed = "BridgeFailed",
}

const BridgeModal = () => {
  const dispatch = useAppDispatch();
  const { params } = useAppSelector(selectModalProps);
  const view = params as BridgeModalViews;
  const isProgress = [
    BridgeModalViews.BridgingIn,
    BridgeModalViews.BridgingOut,
  ].includes(view);
  const isSuccess = [
    BridgeModalViews.BridgeInSuccess,
    BridgeModalViews.BridgeOutSuccess,
  ].includes(view);

  const clearUp = () => {
    dispatch(setModalParams(undefined));
  };

  return (
    <Modal
      variant={ModalVariants.Bridge}
      disableClose={isProgress}
      onClear={clearUp}
    >
      {isProgress && <BridgingView view={view} />}
      {isSuccess && <BridgeSuccessView view={view} />}
      {view === BridgeModalViews.BridgeFailed && <BridgeFailedView />}
    </Modal>
  );
};

export default BridgeModal;
