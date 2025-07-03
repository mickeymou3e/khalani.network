import { ErrorIcon } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules";

import {
  InviteUserBackdropViews,
  useInviteUserBackdrop,
} from "../useInviteUserBackdrop";
import { useResultView } from "./useResultView";

interface ErrorViewProps {
  supportDisclaimer?: boolean;
  setView: (view: InviteUserBackdropViews) => void;
}

const ErrorView = ({ supportDisclaimer, setView }: ErrorViewProps) => {
  const {
    errorViewTitle,
    errorViewSubtitle,
    errorViewPrimaryButton,
    errorViewSecondaryButton,
    handleCancelClick,
  } = useInviteUserBackdrop();

  useResultView();

  return (
    <ResultBackdropView
      title={errorViewTitle}
      subtitle={errorViewSubtitle}
      primaryButtonLabel={errorViewPrimaryButton}
      primaryButtonAction={() => setView(InviteUserBackdropViews.Main)}
      secondaryButtonLabel={errorViewSecondaryButton}
      secondaryButtonAction={handleCancelClick}
      supportDisclaimer={supportDisclaimer}
      icon={<ErrorIcon />}
    />
  );
};

export default ErrorView;
