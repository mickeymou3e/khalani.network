import { CopyToClipboard } from "react-copy-to-clipboard";
import { Trans } from "next-i18next";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { Button } from "@/components/atoms";
import {
  HiddenContent,
  InputLabel,
  Notification,
} from "@/components/molecules";
import { Symbols } from "@/definitions/types";

import { namespace } from "../../config";
import { useWalletDepositsTranslations } from "../../useWalletDepositsTranslations";
import {
  addressTextStyles,
  addressWrapperStyles,
  notificationStyles,
  underlineTextStyles,
} from "./FiatDepositSummary.styles";
import { useFiatDepositSummary } from "./useFiatDepositSummary";

const FiatDepositSummary = () => {
  const {
    summary,
    accountNumber,
    fiatSummaryDisclaimer,
    chooseOptionToReveal,
    copied,
    copy,
    addressNotExist,
  } = useWalletDepositsTranslations(namespace);

  const {
    selectedAsset,
    fiatDepositAccount,
    bankDetails,
    handleOpenSupportModal,
  } = useFiatDepositSummary();

  if (!selectedAsset)
    return <HiddenContent label={chooseOptionToReveal} height="35rem" />;

  if (!fiatDepositAccount)
    return <HiddenContent label={addressNotExist} height="35rem" />;

  return (
    <Box>
      <Typography variant="buttonMedium" mb={6}>
        {summary}
      </Typography>

      <InputLabel
        LabelProps={{ value: accountNumber }}
        sx={{
          mb: 1,
        }}
      />

      <Box sx={addressWrapperStyles}>
        <Typography component="h6" variant="h6" sx={addressTextStyles}>
          {fiatDepositAccount?.ibanCode ?? Symbols.NoValue}
        </Typography>
        {fiatDepositAccount?.ibanCode && (
          <CopyToClipboard text={fiatDepositAccount?.ibanCode}>
            <Button
              variant="translucent"
              complete
              disabledLabel={copied}
              sx={{ width: "100px" }}
            >
              {copy}
            </Button>
          </CopyToClipboard>
        )}
      </Box>

      <Box mb={6}>
        {bankDetails.map((value) => {
          if (!value.value) return null;
          return (
            <Box
              display="flex"
              justifyContent="space-between"
              mb={1}
              key={value.label}
            >
              <Typography variant="body2">{value.label}</Typography>
              <Typography variant="body2" fontWeight="bold">
                {value.value}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Notification
        variant="info"
        customChildren={
          <Box sx={notificationStyles}>
            <Typography variant="body3" display="inline">
              <Trans>{fiatSummaryDisclaimer[0]}</Trans>
            </Typography>
            <Typography variant="body3" ml={0.25} display="inline">
              <Trans>{fiatSummaryDisclaimer[1]}</Trans>
            </Typography>
            <Typography
              variant="body3"
              display="inline"
              sx={underlineTextStyles}
              onClick={handleOpenSupportModal}
            >
              <Trans>{fiatSummaryDisclaimer[2]}</Trans>
            </Typography>
            <Typography variant="body3" ml={0.25} display="inline">
              <Trans>{fiatSummaryDisclaimer[3]}</Trans>
            </Typography>
          </Box>
        }
      />
    </Box>
  );
};

export default FiatDepositSummary;
