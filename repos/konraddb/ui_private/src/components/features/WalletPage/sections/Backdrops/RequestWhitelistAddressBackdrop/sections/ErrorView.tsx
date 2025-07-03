import { StarMountain } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules/BackdropsMolecules/ResultBackdropView";

import { namespace } from "../config";
import { RequestWhitelistAddressBackdropViews } from "../useRequestWhitelistAddressBackdrop";
import { useTranslations } from "../useTranslations";
import { useErrorView } from "./useErrorView";

interface ErrorViewProps {
  setView: (view: RequestWhitelistAddressBackdropViews) => void;
}

const ErrorView = ({ setView }: ErrorViewProps) => {
  const { errorViewTitle, errorViewSubtitle, errorViewPrimaryButton, cancel } =
    useTranslations(namespace);

  const { handleTryAgain, handleCancel } = useErrorView({
    setView,
  });

  return (
    <ResultBackdropView
      title={errorViewTitle}
      subtitle={errorViewSubtitle}
      primaryButtonLabel={errorViewPrimaryButton}
      primaryButtonAction={handleTryAgain}
      secondaryButtonLabel={cancel}
      secondaryButtonAction={handleCancel}
      icon={<StarMountain />}
    />
  );
};

export default ErrorView;
