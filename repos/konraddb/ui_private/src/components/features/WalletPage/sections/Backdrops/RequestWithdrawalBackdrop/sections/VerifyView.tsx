import { VerifyBackdropView } from "@/components/molecules/BackdropsMolecules/VerifyBackdropView";

import { namespace } from "../config";
import { RequestWithdrawalBackdropViews } from "../useRequestWithdrawalBackdrop";
import { useTranslations } from "../useTranslations";
import { useVerifyView } from "./useVerifyView";

interface VerifyViewProps {
  setView: (view: RequestWithdrawalBackdropViews) => void;
}

const VerifyView = ({ setView }: VerifyViewProps) => {
  const { formik } = useVerifyView({ setView });
  const { verifyViewTitle, verifyViewSubtitle, verifyViewPrimaryButton } =
    useTranslations(namespace);

  return (
    <VerifyBackdropView
      title={verifyViewTitle}
      subtitle={verifyViewSubtitle}
      buttonLabel={verifyViewPrimaryButton}
      formik={formik}
      namespace={namespace}
    />
  );
};

export default VerifyView;
