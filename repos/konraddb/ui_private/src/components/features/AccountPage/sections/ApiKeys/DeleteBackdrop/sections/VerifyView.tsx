import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/atoms";
import { BackdropTitle } from "@/components/molecules";
import { deleteApiToken } from "@/services/account/account.api";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectBackdropParams } from "@/store/backdrops";

import { DeleteBackdropViews } from "../useDeleteBackdrop";
import { mainWrapperStyles } from "./common.styles";
import { useVerifyView } from "./useVerifyView";

interface VerifyViewProps {
  setView: (view: DeleteBackdropViews) => void;
}

const VerifyView = ({ setView }: VerifyViewProps) => {
  const dispatch = useAppDispatch();

  const { verifyTitle, verifySubtitle, deleteApiKey } = useVerifyView();

  const apiKey = useAppSelector(selectBackdropParams);

  const handleGetBack = () => {
    setView(DeleteBackdropViews.Warning);
  };

  const handleConfirmDeleteApiKey = async () => {
    await dispatch(deleteApiToken(apiKey.key));

    setView(DeleteBackdropViews.Success);
  };

  return (
    <Box sx={mainWrapperStyles}>
      <BackdropTitle handleGetBack={handleGetBack} title={verifyTitle} />

      <Typography
        variant="subtitle"
        color="primary.gray2"
        align="center"
        mt={2}
      >
        {verifySubtitle}
      </Typography>

      <Button
        onClick={handleConfirmDeleteApiKey}
        variant="contained"
        size="large"
        sx={{ marginTop: 6 }}
        fullWidth
      >
        {deleteApiKey}
      </Button>
    </Box>
  );
};

export default VerifyView;
