import { Modal } from "@/components/molecules";
import { ModalVariants } from "@/definitions/types";

import { RetireModalViews, useRetireModal } from "./useRetireModal";
import { FailedView, LoadingView, RetireCredits, SuccessView } from "./views";

const RetireModal = () => {
  const { view, setView, clearUp } = useRetireModal();
  const isLoadingView = view === RetireModalViews.Loading;

  return (
    <Modal
      variant={ModalVariants.Retire}
      disableClose={isLoadingView}
      onClear={clearUp}
    >
      {view === RetireModalViews.RetireCredits && (
        <RetireCredits setView={setView} />
      )}
      {view === RetireModalViews.Loading && <LoadingView />}
      {view === RetireModalViews.Success && <SuccessView />}
      {view === RetireModalViews.Failed && <FailedView />}
    </Modal>
  );
};

export default RetireModal;
