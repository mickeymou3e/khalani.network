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
} from "./CryptoDepositSummary.styles";
import { useCryptoDepositSummary } from "./useCryptoDepositSummary";

const CryptoDepositSummary = () => {
  const {
    summary,
    cryptoDepositAddressLabel,
    network,
    copy,
    cryptoSummaryDisclaimer,
    copied,
    chooseOptionToReveal,
  } = useWalletDepositsTranslations(namespace);

  const { cryptoDepositAddress, cryptoDepositNetwork, selectedAsset } =
    useCryptoDepositSummary();

  if (!cryptoDepositAddress || !selectedAsset)
    return <HiddenContent label={chooseOptionToReveal} height="27rem" />;

  return (
    <Box>
      <Typography variant="buttonMedium" mb={6}>
        {summary}
      </Typography>

      <InputLabel
        LabelProps={{ value: cryptoDepositAddressLabel }}
        sx={{
          mb: 1,
        }}
      />

      <Box sx={addressWrapperStyles}>
        <Typography component="h6" variant="h6" sx={addressTextStyles}>
          {cryptoDepositAddress ?? Symbols.NoValue}
        </Typography>
        {selectedAsset && cryptoDepositAddress && (
          <CopyToClipboard text={cryptoDepositAddress ?? Symbols.NoValue}>
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

      <Box display="flex" justifyContent="space-between" mb={6}>
        <Typography variant="body2">{network}</Typography>
        <Typography variant="body2" fontWeight="bold">
          {cryptoDepositNetwork}
        </Typography>
      </Box>

      <Notification
        variant="warning"
        customChildren={
          <Typography variant="body3" display="inline">
            <Trans>{cryptoSummaryDisclaimer}</Trans>
          </Typography>
        }
      />
    </Box>
  );
};

export default CryptoDepositSummary;
