import { Box } from "@mui/material";

import { VerifyBackdropView } from "@/components/molecules/BackdropsMolecules/VerifyBackdropView";

import { namespace } from "../config";
import { LoginBackdropViews } from "../useLoginBackdropContents";
import { useLoginBackdropTranslations } from "../useLoginBackdropTranslations";
import { mainWrapperStyles } from "./common.styles";
import { useVerifyView } from "./useVerifyView";

interface VerifyViewProps {
  setView: (view: LoginBackdropViews) => void;
}

const VerifyView = ({ setView }: VerifyViewProps) => {
  const { verifyToLogin, authenticatorCodeWasSent, verify } =
    useLoginBackdropTranslations(namespace);

  const { formik, handleBack } = useVerifyView({
    setView,
  });

  return (
    <Box sx={mainWrapperStyles}>
      <VerifyBackdropView
        title={verifyToLogin}
        subtitle={authenticatorCodeWasSent}
        buttonLabel={verify}
        formik={formik}
        handleGetBack={handleBack}
        namespace={namespace}
      />
    </Box>
  );
};

export default VerifyView;
