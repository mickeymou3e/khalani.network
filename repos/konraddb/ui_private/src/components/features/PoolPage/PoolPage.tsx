import { useTranslation } from "next-i18next";

import { Box, Stack, Typography } from "@mui/material";

import { ToggleButtonGroup } from "@/components/atoms";
import { AppLayout } from "@/components/organisms";
import { PoolMode } from "@/store/pool";

import { namespace } from "./config";
import { DepositForm, DepositSummary } from "./Deposit";
import { History } from "./History";
import {
  actionAreaContainerStyles,
  formContainerStyles,
  rootStyles,
} from "./PoolPage.styles";
import { PoolRedeemModal } from "./PoolRedeemModal";
import { RedeemForm, RedeemSummary } from "./Redeem";
import usePoolPage from "./usePoolPage";

const PoolPage = () => {
  const { t } = useTranslation(namespace);
  const { mode, modes, isDeposit, handleModeChange } = usePoolPage();

  return (
    <AppLayout>
      <Box sx={rootStyles}>
        <Stack spacing="4rem">
          <Typography component="h1" variant="h4">
            {t(`${namespace}:pageTitle`)}
          </Typography>

          <Box sx={actionAreaContainerStyles}>
            <Box sx={formContainerStyles}>
              <ToggleButtonGroup
                currentValue={mode}
                values={modes}
                exclusive
                handleAction={(_, value) => handleModeChange(value as PoolMode)}
                fullWidth
              />
              {isDeposit ? <DepositForm /> : <RedeemForm />}
            </Box>

            {isDeposit ? <DepositSummary /> : <RedeemSummary />}
          </Box>

          <History />

          <PoolRedeemModal />
        </Stack>
      </Box>
    </AppLayout>
  );
};

export default PoolPage;
