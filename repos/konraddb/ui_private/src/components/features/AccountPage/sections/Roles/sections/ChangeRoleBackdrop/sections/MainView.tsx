import { Trans } from "next-i18next";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { Button } from "@/components/atoms";
import {
  BackdropTitle,
  GrayTextWrapper,
  Notification,
} from "@/components/molecules";

import {
  ChangeRoleBackdroppViews,
  useChangeRoleBackdrop,
} from "../useChangeRoleBackdrop";
import { formWrapper, mainWrapperStyles } from "./common.styles";
import { useMainView } from "./useMainView";

interface MainViewProps {
  setView: (view: ChangeRoleBackdroppViews) => void;
  setCredentials: (credentials: any) => void;
}

const MainView = ({ setView, setCredentials }: MainViewProps) => {
  const {
    mainViewTitle,
    mainViewSubtitle,
    contentTitle,
    content1,
    content2,
    content3,
    infoBox,
    mainViewPrimaryButton,
    mainViewSecondaryButton1,
  } = useChangeRoleBackdrop();
  const { handlePrimaryButtonClick, handleSecondaryButtonClick } = useMainView({
    setView,
    setCredentials,
  });

  return (
    <Box sx={mainWrapperStyles}>
      <BackdropTitle title={mainViewTitle} subtitle={mainViewSubtitle} />

      <Box sx={formWrapper}>
        <Typography color="primary.gray2">{contentTitle}</Typography>

        <GrayTextWrapper content={[content1, content2, content3]} />

        <Notification
          variant="info"
          customChildren={
            <Trans>
              <Typography variant="body3" display="inline">
                {infoBox}
              </Typography>
            </Trans>
          }
        />
      </Box>

      <Box width="100%">
        <Button
          onClick={handlePrimaryButtonClick}
          variant="contained"
          size="large"
          sx={{ mb: 4 }}
          fullWidth
        >
          {mainViewPrimaryButton}
        </Button>

        <Button
          onClick={handleSecondaryButtonClick}
          variant="text"
          size="large"
          fullWidth
        >
          {mainViewSecondaryButton1}
        </Button>
      </Box>
    </Box>
  );
};

export default MainView;
