import { VerifyBackdropView } from "@/components/molecules/BackdropsMolecules/VerifyBackdropView";
import { WhitelistAddressRequestProps } from "@/services/wallet";

import { namespace } from "../config";
import { RequestWhitelistAddressBackdropViews } from "../useRequestWhitelistAddressBackdrop";
import { useTranslations } from "../useTranslations";
import { useVerifyView } from "./useVerifyView";

interface VerifyViewProps {
  setView: (view: RequestWhitelistAddressBackdropViews) => void;
  credentials: WhitelistAddressRequestProps;
}

const VerifyView = ({ setView, credentials }: VerifyViewProps) => {
  const { formik } = useVerifyView({ setView, credentials });
  const { verifyViewTitle, verifyViewSubtitle, verifyViewPrimaryButton } =
    useTranslations(namespace);

  return (
    <VerifyBackdropView
      title={verifyViewTitle}
      subtitle={verifyViewSubtitle}
      buttonLabel={verifyViewPrimaryButton}
      formik={formik}
      handleGetBack={() => setView(RequestWhitelistAddressBackdropViews.Main)}
      namespace={namespace}
    />
  );
};

export default VerifyView;
