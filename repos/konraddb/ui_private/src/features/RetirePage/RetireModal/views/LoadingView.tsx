import { useTranslation } from "next-i18next";

import { Box, Stack, Typography } from "@mui/material";

import { LoaderIndicator } from "@/components/atoms";
import { Notification } from "@/components/molecules";

import { namespace } from "../config";

const LoadingView = () => {
  const { t } = useTranslation(namespace);

  const loadingTitle = t(`${namespace}:loadingTitle`);
  const loadingSubtitle = t(`${namespace}:loadingSubtitle`);
  const loadingHintBold = t(`${namespace}:loadingHintBold`);
  const loadingHint = t(`${namespace}:loadingHint`);

  return (
    <Stack alignItems="center" gap={3}>
      <LoaderIndicator />
      <Typography component="h5" variant="h5" align="center" mt={6}>
        {loadingTitle}
      </Typography>
      <Typography color="primary.gray2" align="center" mb={3}>
        {loadingSubtitle}
      </Typography>
      <Notification
        variant="info"
        customChildren={
          <Box>
            <Typography variant="body3" fontWeight="bold" display="inline">
              {loadingHintBold}
            </Typography>
            <Typography variant="body3" ml={0.5} display="inline">
              {loadingHint}
            </Typography>
          </Box>
        }
      />
    </Stack>
  );
};

export default LoadingView;
