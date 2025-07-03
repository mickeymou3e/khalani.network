import { namespace } from "@/components/features/WalletPage/sections/Withdrawals/config";
import { VerifyBackdropView } from "@/components/molecules/BackdropsMolecules/VerifyBackdropView";

import {
  ChangeRoleBackdroppViews,
  useChangeRoleBackdrop,
} from "../useChangeRoleBackdrop";
import { useVerifyView } from "./useVerifyView";

interface VerifyViewProps {
  setView: (view: ChangeRoleBackdroppViews) => void;
}

const VerifyView = ({ setView }: VerifyViewProps) => {
  const { formik, handlePrimaryButtonClick } = useVerifyView({ setView });
  const { verifyViewTitle, verifyViewSubtitle, verifyViewPrimaryButton } =
    useChangeRoleBackdrop();

  return (
    <VerifyBackdropView
      title={verifyViewTitle}
      subtitle={verifyViewSubtitle}
      buttonLabel={verifyViewPrimaryButton}
      formik={formik}
      namespace={namespace}
      handleGetBack={handlePrimaryButtonClick}
    />
  );
};

export default VerifyView;
