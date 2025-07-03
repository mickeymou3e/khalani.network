import { useTranslation } from "next-i18next";

import { Stack, Typography } from "@mui/material";

import { LoaderIndicator } from "@/components/atoms";
import { Notification } from "@/components/molecules";
import { evaluate } from "@/utils/logic";

import { BridgeModalViews } from "../BridgeModal";
import { namespace } from "../config";

type BridgingViewProps = {
  view: BridgeModalViews;
};

const BridgingView = ({ view }: BridgingViewProps) => {
  const { t } = useTranslation(namespace);
  const isBridgeInProgressView = view === BridgeModalViews.BridgingIn;

  const title = evaluate<string>(
    [!isBridgeInProgressView, t(`${namespace}:bridgingOutTitle`)],
    [isBridgeInProgressView, t(`${namespace}:bridgingInTitle`)]
  );
  const subtitle = t(`${namespace}:bridgingSubtitle`);
  const hint = t(`${namespace}:bridgingHint`);

  return (
    <Stack alignItems="center" gap={3}>
      <LoaderIndicator />
      <Typography component="h5" variant="h5" align="center" mt={6}>
        {title}
      </Typography>
      <Typography color="primary.gray2" align="center" mb={3}>
        {subtitle}
      </Typography>
      <Notification variant="info" primaryText={hint} />
    </Stack>
  );
};

export default BridgingView;
