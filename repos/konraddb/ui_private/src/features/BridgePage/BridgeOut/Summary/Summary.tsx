import { Stack, Typography } from "@mui/material";

import { Button } from "@/components/atoms";
import { Notification } from "@/components/molecules";

import { DestinationAssets } from "./DestinationAssets";
import { SourceAssets } from "./SourceAssets";
import { containerStyle } from "./Summary.styles";
import { useSummary } from "./useSummary";

const Summary = () => {
  const {
    isSelectionPopulated,
    titleText,
    actionText,
    summaryDescription,
    handleBridgeOutClick,
  } = useSummary();

  return (
    <Stack sx={containerStyle} gap={6} flex={1}>
      <Typography
        variant="subtitle2"
        color="primary.main"
        textTransform="uppercase"
      >
        {titleText}
      </Typography>

      <SourceAssets />
      <DestinationAssets />

      {isSelectionPopulated && (
        <Notification variant="info" primaryText={summaryDescription} />
      )}

      <Button
        disabled={!isSelectionPopulated}
        variant="contained"
        size="large"
        fullWidth
        onClick={handleBridgeOutClick}
      >
        {actionText}
      </Button>
    </Stack>
  );
};

export default Summary;
