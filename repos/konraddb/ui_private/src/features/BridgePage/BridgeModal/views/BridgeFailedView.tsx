import { FailureBackdropView } from "@/components/molecules";
import { resetSelection } from "@/features/BridgePage/store";
import { useAppDispatch } from "@/store";
import { closeModal } from "@/store/ui";

const BridgeFailedView = () => {
  const dispatch = useAppDispatch();

  const handlePrimaryButtonClick = () => {
    dispatch(closeModal());
  };

  const handleSecondaryButtonClick = () => {
    dispatch(closeModal());
    dispatch(resetSelection());
  };

  return (
    <FailureBackdropView
      primaryButton={{
        action: handlePrimaryButtonClick,
      }}
      secondaryButton={{
        action: handleSecondaryButtonClick,
      }}
    />
  );
};

export default BridgeFailedView;
