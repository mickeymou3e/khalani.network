import { StarMountain } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules/BackdropsMolecules/ResultBackdropView";

import { namespace } from "../config";
import { useTranslations } from "../useTranslations";

const SuccessView = () => {
  const { successViewTitle, successViewSubtitle, successViewPrimaryButton } =
    useTranslations(namespace);

  // TODO: on success fetch list list of whitelisted addresses

  return (
    <ResultBackdropView
      title={successViewTitle}
      subtitle={successViewSubtitle}
      primaryButtonLabel={successViewPrimaryButton}
      icon={<StarMountain />}
    />
  );
};

export default SuccessView;
