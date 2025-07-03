import { FormikProps } from "formik";
import { Trans } from "next-i18next";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { Button } from "@/components/atoms";
import {
  HiddenContent,
  InfoPopover,
  InputLabel,
  Notification,
} from "@/components/molecules";
import { Symbols } from "@/definitions/types";

import { namespace } from "../../config";
import { useWalletWithdrawalTranslations } from "../../useWalletWithdrawalTranslations";
import {
  currencyInlineStyles,
  notificationStyles,
  rowTextStyles,
  underlineTextStyles,
  withdrawalDetailsSummaryStyles,
} from "./FiatWithdrawSummary.styles";
import { useFiatWithdrawSummary } from "./useFiatWithdrawSummary";

interface FiatWithdrawSummaryProps {
  formik: FormikProps<any>;
}

const FiatWithdrawSummary = ({ formik }: FiatWithdrawSummaryProps) => {
  const {
    summary,
    reviewWithdraw,
    reviewWithdrawMessage,
    yourAccount,
    requestWithdrawal,
    fiatSummaryDisclaimer,
    chooseOptionToReveal,
  } = useWalletWithdrawalTranslations(namespace);

  const {
    userIbans,
    bankDetails,
    withdrawalDetails,
    selectedAsset,
    handleOpenSupportModal,
  } = useFiatWithdrawSummary({
    formik,
  });

  if (!formik.values.withdrawalAsset)
    return <HiddenContent label={chooseOptionToReveal} height="35rem" />;

  return (
    <Box>
      <Typography variant="buttonMedium" mb={6}>
        {summary}
      </Typography>

      <InputLabel
        LabelProps={{ value: yourAccount }}
        sx={{
          mb: 0.5,
        }}
      />
      <Typography component="h6" variant="h6" mb={6}>
        {userIbans[0]?.iban ?? Symbols.NoValue}
      </Typography>

      <Box mb={6}>
        {bankDetails.map(({ label, value }, index) => {
          if (!value) return null;
          return (
            <Box
              sx={rowTextStyles(bankDetails.length - 1 === index ? 0 : 1)}
              key={`${label}`}
            >
              <Typography variant="body2">{label}</Typography>
              <Typography variant="body2" fontWeight="bold">
                {value}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: 2,
        }}
      >
        <InputLabel LabelProps={{ value: reviewWithdraw }} />
        <InfoPopover>
          <Typography variant="body2" color="primary.gray2">
            {reviewWithdrawMessage}
          </Typography>
        </InfoPopover>
      </Box>
      <Box sx={withdrawalDetailsSummaryStyles}>
        <Box sx={rowTextStyles(1)}>
          <Typography variant="body2">{withdrawalDetails[0].label}</Typography>
          <Box sx={currencyInlineStyles}>
            <Typography variant="body2" fontWeight="bold">
              {withdrawalDetails[0].value}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {selectedAsset}
            </Typography>
          </Box>
        </Box>
        <Box sx={rowTextStyles(1)}>
          <Typography variant="body2">{withdrawalDetails[1].label}</Typography>
          {withdrawalDetails[1].value}
        </Box>
        <Box sx={rowTextStyles(0)}>
          <Typography variant="body2">{withdrawalDetails[2].label}</Typography>
          <Box sx={currencyInlineStyles}>
            <Typography variant="body2" fontWeight="bold">
              {withdrawalDetails[2].value}
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {selectedAsset}
            </Typography>
          </Box>
        </Box>
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

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={!userIbans[0]?.iban || !formik.isValid}
        sx={{
          mt: 6,
        }}
      >
        {requestWithdrawal}
      </Button>
    </Box>
  );
};

export default FiatWithdrawSummary;
