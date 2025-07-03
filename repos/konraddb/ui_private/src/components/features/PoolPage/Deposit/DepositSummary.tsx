import { Button, Stack, Typography } from "@mui/material";

import { PoolModes } from "@/store/pool";

import { ActionSummary } from "../ActionSummary";
import { namespace } from "./config";
import { useDepositSummary } from "./useDepositSummary";

const DepositSummary = () => {
  const { buttonText, summaryLabel, assetsSelectionExists, handlePoolAction } =
    useDepositSummary();

  return (
    <Stack gap="3rem" flex={1}>
      <Typography
        variant="subtitle2"
        color="primary.main"
        textTransform="uppercase"
      >
        {summaryLabel}
      </Typography>

      <ActionSummary type={PoolModes.Deposit} namespace={namespace} />

      <Button
        disabled={!assetsSelectionExists}
        onClick={handlePoolAction}
        variant="contained"
        size="large"
        fullWidth
      >
        {buttonText}
      </Button>
    </Stack>
  );
};

export default DepositSummary;
