import { NeutronNetwork } from "@/components/atoms";
import { ResultBackdropView } from "@/components/molecules/BackdropsMolecules/ResultBackdropView";

import { useSuccessView } from "./useSuccessView";

const SuccessView = () => {
  const { verifyApiKeyCreated, successSubtitle, backToApiKeys } =
    useSuccessView();

  return (
    <ResultBackdropView
      title={verifyApiKeyCreated}
      subtitle={successSubtitle}
      primaryButtonLabel={backToApiKeys}
      icon={<NeutronNetwork />}
    />
  );
};

export default SuccessView;
