import { FailureBackdropView } from "@/components/molecules";
import { resetSelection } from "@/features/RetirePage/store";
import { useAppDispatch } from "@/store";
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
