import { CopyToClipboard } from "react-copy-to-clipboard";

import PreviewIcon from "@mui/icons-material/Preview";
import { Stack, Typography } from "@mui/material";

import { Button } from "@/components/atoms";
import { InfoPanel, Notification } from "@/components/molecules";
import { Symbols } from "@/definitions/types";
import { iconStyles } from "@/styles/others/muiIconStyles";

import { containerStyle, missingAssetPlaceholderStyle } from "./Summary.styles";
import { useSummary } from "./useSummary";

const Summary = () => {
  const {
    selectedRegistry,
    unavailabilityReasonText,
    summary,
    transferRegistryAccountId,
    copy,
    summaryContents,
    bridgingHint,
    copied,
  } = useSummary();

  if (unavailabilityReasonText) {
    return (
      <Stack sx={missingAssetPlaceholderStyle} spacing={2}>
        <PreviewIcon sx={iconStyles()} />
        <Typography color="primary.gray2" variant="body2">
          {unavailabilityReasonText}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack sx={containerStyle} spacing={6}>
      <Typography
        color="primary.main"
        variant="subtitle2"
        textTransform="uppercase"
      >
        {summary}
      </Typography>

      <Stack direction="row" justifyContent="space-between">
        <Stack spacing={1}>
          <Typography color="primary.gray2" variant="body2">
            {transferRegistryAccountId}
          </Typography>
          <Typography color="primary.main" variant="h6">
            {selectedRegistry?.transferAccountId ?? Symbols.NoValue}
          </Typography>
        </Stack>
        <CopyToClipboard text={selectedRegistry?.transferAccountId ?? ""}>
          <Button
            disabled={!selectedRegistry}
            variant="translucent"
            complete
            disabledLabel={copied}
          >
            {copy}
          </Button>
        </CopyToClipboard>
      </Stack>

      <InfoPanel content={summaryContents} spacing={1} />

      <Notification primaryText={bridgingHint} variant="info" />
    </Stack>
  );
};

export default Summary;
