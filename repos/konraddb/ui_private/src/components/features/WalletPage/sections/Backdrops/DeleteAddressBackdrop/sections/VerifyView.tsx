import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/atoms";

import { namespace } from "../config";
import { DeleteAddressBackdropViews } from "../useDeleteAddressBackdrop";
import { useTranslations } from "../useTranslations";
import { mainWrapperStyles, textWrapperStyles } from "./common.styles";
import { useVerifyView } from "./useVerifyView";

interface VerifyViewProps {
  setView: (view: DeleteAddressBackdropViews) => void;
}

const VerifyView = ({ setView }: VerifyViewProps) => {
  const { primaryButtonAction, secondaryButtonAction } = useVerifyView({
    setView,
  });

  const {
    verifyViewTitle,
    verifyViewSubtitle,
    disclaimer,
    discalimerList1,
    discalimerList2,
    verifyViewPrimaryButton,
    verifyViewSecondaryButton,
  } = useTranslations(namespace);

  return (
    <Box sx={mainWrapperStyles}>
      <Typography component="h5" variant="h5" align="center">
        {verifyViewTitle}
      </Typography>

      <Typography color="primary.gray2" align="center" mt={3}>
        {verifyViewSubtitle}
      </Typography>

      <Typography color="primary.gray2" align="center" mt={6}>
        {disclaimer}
      </Typography>

      <Box sx={textWrapperStyles}>
        <Typography variant="body2">{discalimerList1}</Typography>

        <Typography variant="body2" mt={1}>
          {discalimerList2}
        </Typography>
      </Box>

      <Button
        onClick={primaryButtonAction}
        variant="contained"
        size="large"
        sx={{ marginTop: 6 }}
        fullWidth
      >
        {verifyViewPrimaryButton}
      </Button>

      <Button
        onClick={secondaryButtonAction}
        variant="text"
        size="large"
        sx={{ marginTop: 4 }}
        fullWidth
      >
        {verifyViewSecondaryButton}
      </Button>
    </Box>
  );
};

export default VerifyView;
