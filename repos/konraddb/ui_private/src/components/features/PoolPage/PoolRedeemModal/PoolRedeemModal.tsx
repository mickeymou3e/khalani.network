import { Modal } from "@/components/molecules";
import { ModalVariants } from "@/definitions/types";

import { usePoolRedeemModal } from "./usePoolRedeemModal";
import { FailedView, LoadingView, SuccessView } from "./views";

const PoolRedeemModal = () => {
  const { namespace, isSuccess, isFailed, isLoading, clearUp } =
    usePoolRedeemModal();

  return (
    <Modal
      variant={ModalVariants.PoolRedeem}
      disableClose={isLoading}
      onClear={clearUp}
    >
      {isLoading && <LoadingView namespace={namespace} />}
      {isSuccess && <SuccessView namespace={namespace} />}
      {isFailed && <FailedView />}
    </Modal>
  );
};

export default PoolRedeemModal;
