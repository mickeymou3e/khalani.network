import { SilentGuy } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules/BackdropsMolecules/ResultBackdropView";

import { namespace } from "../config";
import { useLoginBackdropTranslations } from "../useLoginBackdropTranslations";

interface BlockedViewProps {
  handleResetPassword: () => void;
}

const BlockedView = ({ handleResetPassword }: BlockedViewProps) => {
  const {
    blockedViewTitle,
    blockedViewDescription,
    goToHome,
    resetMyPassword,
  } = useLoginBackdropTranslations(namespace);

  return (
    <ResultBackdropView
      title={blockedViewTitle}
      subtitle={blockedViewDescription}
      primaryButtonLabel={goToHome}
      primaryButtonAction={handleResetPassword}
      secondaryButtonLabel={resetMyPassword}
      icon={<SilentGuy width={96} height={96} />}
    />
  );
};

export default BlockedView;
