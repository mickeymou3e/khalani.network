import { FormikProps } from "formik";

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
  addressTextStyles,
  addressWrapper,
  currencyInlineStyles,
  rowTextStyles,
  withdrawalDetailsSummaryStyles,
} from "./CryptoWithdrawSummary.styles";
import { useCryptoWithdrawSummary } from "./useCryptoWithdrawSummary";

interface CryptoWithdrawSummaryProps {
  formik: FormikProps<any>;
}

const CryptoWithdrawSummary = ({ formik }: CryptoWithdrawSummaryProps) => {
  const {
    summary,
    withdrawAddress,
    add,
    reviewWithdraw,
    reviewWithdrawMessage,
    network,
    requestWithdrawal,
    cryptoSummaryDisclaimer,
    cryptoSummaryDisclaimerBold,
    chooseOptionToReveal,
  } = useWalletWithdrawalTranslations(namespace);

  const {
    selectedAsset,
    selectedAssetDetails,
    selectedAssetNetwork,
    depositAddress,
    withdrawalDetails,
    handleAddNewAddress,
  } = useCryptoWithdrawSummary({
    formik,
  });

  if (!selectedAsset)
    return <HiddenContent label={chooseOptionToReveal} height="30rem" />;

  return (
    <Box>
      <Typography variant="buttonMedium" mb={6}>
        {summary}
      </Typography>

      <InputLabel
        LabelProps={{ value: withdrawAddress }}
        sx={{
          mb: 1,
        }}
      />
      <Box sx={addressWrapper}>
        <Typography component="h6" variant="h6" sx={addressTextStyles}>
          {selectedAssetDetails?.address ?? Symbols.NoValue}
        </Typography>

        {selectedAsset && depositAddress && (
          <Button
            variant="contained"
            disabled={!!selectedAssetDetails?.address}
            onClick={handleAddNewAddress}
          >
            {add}
          </Button>
        )}
      </Box>

      <Typography variant="body2" mb={6}>
        {selectedAssetDetails?.label}
      </Typography>

      <Box sx={rowTextStyles(6)}>
        <Typography variant="body2">{network}</Typography>
        <Typography variant="body2" fontWeight="bold">
          {selectedAssetNetwork ?? Symbols.NoValue}
        </Typography>
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
        variant="warning"
        customChildren={
          <Box>
            <Typography variant="body3" display="inline">
              {cryptoSummaryDisclaimer}
            </Typography>
            <Typography
              variant="body3"
              fontWeight="bold"
              ml={0.5}
              display="inline"
            >
              {cryptoSummaryDisclaimerBold}
            </Typography>
          </Box>
        }
      />

      <Button
        variant="contained"
        size="large"
        fullWidth
        type="submit"
        disabled={
          !formik.dirty ||
          (formik.dirty && !formik.isValid) ||
          formik.isSubmitting
        }
        sx={{
          mt: 6,
        }}
      >
        {requestWithdrawal}
      </Button>
    </Box>
  );
};

export default CryptoWithdrawSummary;
