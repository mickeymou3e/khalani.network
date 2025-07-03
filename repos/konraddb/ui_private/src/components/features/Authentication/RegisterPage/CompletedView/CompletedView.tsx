import { Box, Button } from "@mui/material";

import { StarMountain } from "@/components/atoms";
import { BackdropTitle } from "@/components/molecules";

import {
  buttonContainerStyle,
  containerStyle,
  innerContainerStyle,
} from "./CompletedView.styles";
import { useCompletedView } from "./useCompletedView";

const CompletedView = () => {
  const {
    accountCreatedTitle,
    accountCreatedSubtitle,
    loginButtonText,
    handleGoToLogin,
  } = useCompletedView();

  return (
    <Box sx={containerStyle}>
      <Box sx={innerContainerStyle}>
        <StarMountain />
        <BackdropTitle
          title={accountCreatedTitle}
          subtitle={accountCreatedSubtitle}
        />
        <Box sx={buttonContainerStyle}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleGoToLogin}
          >
            {loginButtonText}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CompletedView;
