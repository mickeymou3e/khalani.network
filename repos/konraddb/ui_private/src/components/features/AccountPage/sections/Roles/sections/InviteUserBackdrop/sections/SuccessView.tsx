import { StarMountain } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules/BackdropsMolecules/ResultBackdropView";

import { useInviteUserBackdrop } from "../useInviteUserBackdrop";
import { useResultView } from "./useResultView";

const SuccessView = () => {
  const { successViewTitle, successViewSubtitle, successViewPrimaryButton } =
    useInviteUserBackdrop();

  useResultView();

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
