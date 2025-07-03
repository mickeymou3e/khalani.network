import { AuthenticatorGuy, StarMountain } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules/BackdropsMolecules/ResultBackdropView";

import { namespace } from "../config";
import { useTranslations } from "../useTranslations";

const ResultView = ({ isSuccess }: { isSuccess: boolean }) => {
  const {
    successViewTitle,
    successViewSubtitle,
    successViewPrimaryButton,
    errorViewTitle,
    errorViewSubtitle,
    errorViewPrimaryButton,
  } = useTranslations(namespace);

  return (
    <ResultBackdropView
      title={isSuccess ? successViewTitle : errorViewTitle}
      subtitle={isSuccess ? successViewSubtitle : errorViewSubtitle}
      primaryButtonLabel={
        isSuccess ? successViewPrimaryButton : errorViewPrimaryButton
      }
      icon={isSuccess ? <AuthenticatorGuy /> : <StarMountain />}
    />
  );
};

export default ResultView;
