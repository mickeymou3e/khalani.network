import { useTranslation } from "next-i18next";

import { Stack, Typography } from "@mui/material";

import { LoaderIndicator } from "@/components/atoms";
import { Notification } from "@/components/molecules";

const LoadingView = ({ namespace }: { namespace: string }) => {
  const { t } = useTranslation(namespace);

  return (
    <Stack alignItems="center" gap={6}>
      <LoaderIndicator />
      <Stack alignItems="center" gap={2}>
        <Typography component="h5" variant="h5" align="center">
          {t(`${namespace}:loadingTitle`)}
        </Typography>
        <Typography color="primary.gray2" align="center">
          {t(`${namespace}:loadingSubtitle`)}
        </Typography>
      </Stack>
      <Notification
        variant="info"
        primaryText={t(`${namespace}:loadingHint`) as string}
      />
    </Stack>
  );
};

export default LoadingView;
