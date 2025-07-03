import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/atoms";
import { GrayTextWrapper } from "@/components/molecules";

import { DeleteBackdropViews } from "../useDeleteBackdrop";
import { mainWrapperStyles } from "./common.styles";
import { useWarningView } from "./useWarningView";

interface WarningViewProps {
  setView: (view: DeleteBackdropViews) => void;
  handleCloseBackdrop: () => void;
}

const WarningView = ({ setView, handleCloseBackdrop }: WarningViewProps) => {
  const {
    warningTitle,
    warningSubtitle,
    warningSubtitle2,
    content1,
    content2,
    next,
    cancel,
  } = useWarningView();

  return (
    <Box sx={mainWrapperStyles}>
      <Typography component="h5" variant="h5" mb={2}>
        {warningTitle}
      </Typography>

      <Typography
        variant="subtitle"
        color="primary.gray2"
        align="center"
        mb={6}
      >
        {warningSubtitle}
      </Typography>

      <Typography color="primary.gray2" align="center" mb={3}>
        {warningSubtitle2}
      </Typography>

      <GrayTextWrapper content={[content1, content2]} />

      <Button
        onClick={() => setView(DeleteBackdropViews.Verify)}
        variant="contained"
        size="large"
        sx={{ marginTop: 6 }}
        fullWidth
      >
        {next}
      </Button>

      <Button
        onClick={handleCloseBackdrop}
        variant="text"
        size="large"
        sx={{ marginTop: 4 }}
        fullWidth
      >
        {cancel}
      </Button>
    </Box>
  );
};

export default WarningView;
