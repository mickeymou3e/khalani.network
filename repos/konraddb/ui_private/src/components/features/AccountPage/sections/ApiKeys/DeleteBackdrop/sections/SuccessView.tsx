import { NeutronNetwork } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules/BackdropsMolecules/ResultBackdropView";

import { useSuccessView } from "./useSuccessView";

const SuccessView = () => {
  const { successTitle, successSubtitle, backToApiKeys } = useSuccessView();

  return (
    <ResultBackdropView
      title={successTitle}
      subtitle={successSubtitle}
      primaryButtonLabel={backToApiKeys}
      icon={<NeutronNetwork />}
    />
  );
};

export default SuccessView;
