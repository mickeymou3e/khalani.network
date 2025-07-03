import { StarMountain } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules/BackdropsMolecules/ResultBackdropView";

import { useChangeRoleBackdrop } from "../useChangeRoleBackdrop";
import { useSuccessView } from "./useSuccessView";

const SuccessView = () => {
  const { successViewTitle, successViewSubtitle, successViewPrimaryButton } =
    useChangeRoleBackdrop();

  useSuccessView();

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
