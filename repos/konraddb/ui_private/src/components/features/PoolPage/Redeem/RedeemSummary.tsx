import { Button, Stack, Typography } from "@mui/material";

import { PoolModes } from "@/store/pool";

import { ActionSummary } from "../ActionSummary";
import { namespace } from "./config";
import { useRedeemSummary } from "./useRedeemSummary";

const RedeemSummary = () => {
  const {
    buttonText,
    summaryLabel,
    assetsSelectionExists,
    handleRedeemAction,
  } = useRedeemSummary();

  return (
    <Stack gap="3rem" flex={1}>
      <Typography
        variant="subtitle2"
        color="primary.main"
        textTransform="uppercase"
      >
        {summaryLabel}
      </Typography>

      <ActionSummary type={PoolModes.Redeem} namespace={namespace} />

      <Button
        disabled={!assetsSelectionExists}
        onClick={handleRedeemAction}
        variant="contained"
        size="large"
        fullWidth
      >
        {buttonText}
      </Button>
    </Stack>
  );
};

export default RedeemSummary;
