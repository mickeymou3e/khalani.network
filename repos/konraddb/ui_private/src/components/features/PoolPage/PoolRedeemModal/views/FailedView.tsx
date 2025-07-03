import { FailureBackdropView } from "@/components/molecules";
import { useAppDispatch } from "@/store";
import { resetSelection } from "@/store/pool";
import { closeModal } from "@/store/ui";

const FailedView = () => {
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

export default FailedView;
