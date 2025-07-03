import { StarMountain } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules/BackdropsMolecules/ResultBackdropView";

import { namespace } from "../config";
import { RequestWithdrawalBackdropViews } from "../useRequestWithdrawalBackdrop";
import { useTranslations } from "../useTranslations";
import { useErrorView } from "./useErrorView";

interface ErrorViewProps {
  setView: (view: RequestWithdrawalBackdropViews) => void;
}

const ErrorView = ({ setView }: ErrorViewProps) => {
  const {
    errorViewTitle,
    errorViewSubtitle,
    errorViewPrimaryButton,
    errorViewSecondaryButton,
  } = useTranslations(namespace);

  const { handleTryAgain, handleCancel } = useErrorView({
    setView,
  });

  return (
    <ResultBackdropView
      title={errorViewTitle}
      subtitle={errorViewSubtitle}
      primaryButtonLabel={errorViewPrimaryButton}
      primaryButtonAction={handleTryAgain}
      secondaryButtonLabel={errorViewSecondaryButton}
      secondaryButtonAction={handleCancel}
      icon={<StarMountain />}
    />
  );
};

export default ErrorView;
