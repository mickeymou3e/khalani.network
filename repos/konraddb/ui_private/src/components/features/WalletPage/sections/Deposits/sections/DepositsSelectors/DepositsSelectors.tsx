import QRCode from "react-qr-code";
import { Trans } from "next-i18next";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import {
  HiddenContent,
  InputLabel,
  SimpleSelect,
} from "@/components/molecules";
import { Symbols } from "@/definitions/types";

import { namespace } from "../../config";
import { useWalletDepositsTranslations } from "../../useWalletDepositsTranslations";
import {
  componentWrapperStyles,
  innerQrCodeWrapper,
  qrCodeWrapper,
  smallSummaryBoxStyles,
} from "./DepositsSelectors.styles";
import { useDepositsSelectors } from "./useDepositsSelectors";

const DepositsSelectors = () => {
  const {
    assetsProvider,
    selectedAsset,
    selectedAssetBalance,
    depositAddress,
    isFiat,
    handleSelect,
    handleContactSupport,
  } = useDepositsSelectors();

  const {
    yourDeposit,
    balance,
    selectOption,
    search,
    chooseOptionToReveal,
    transferInstructions,
    transferInstructionsMessage1,
    transferInstructionsMessage2,
    transferInstructionsMessage3,
    transferInstructionsMessage4,
    scanQrCode,
    createWalletToReveal,
    createWalletLabel,
  } = useWalletDepositsTranslations(namespace);

  return (
    <Box sx={componentWrapperStyles}>
      <SimpleSelect
        options={assetsProvider}
        placeholder={selectOption}
        setValue={(val) => handleSelect(val)}
        value={selectedAsset}
        searchable
        searchPlaceholder={search}
        searchSize="small"
        showDescription
        TopLabelProps={{
          LabelProps: { value: yourDeposit },
          SecondaryLabelProps: { value: balance },
          TertiaryLabelProps: {
            value: selectedAsset
              ? selectedAssetBalance?.assetBalance || Symbols.ZeroBalance
              : Symbols.NoBalance,
          },
        }}
      />

      {!selectedAsset && (
        <HiddenContent label={chooseOptionToReveal} height="15rem" />
      )}

      {!isFiat && selectedAsset && (
        <>
          {!depositAddress && (
            <HiddenContent
              label={createWalletToReveal}
              height="15rem"
              icon="WALLET"
              primaryButtonLabel={createWalletLabel}
              handlePrimaryButtonAction={handleContactSupport}
            />
          )}

          {depositAddress && (
            <Box>
              <InputLabel
                LabelProps={{ value: scanQrCode }}
                sx={{
                  mb: 2,
                }}
              />
              <Box sx={qrCodeWrapper}>
                <Box sx={innerQrCodeWrapper}>
                  <QRCode size={190} value={depositAddress} />
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}

      {isFiat && selectedAsset && (
        <>
          <InputLabel LabelProps={{ value: transferInstructions }} />

          <Box sx={smallSummaryBoxStyles}>
            <Typography variant="body2" mb={1}>
              {transferInstructionsMessage1}
            </Typography>
            <Typography variant="body2" display="inline">
              <Trans>{transferInstructionsMessage2}</Trans>
            </Typography>
            <Typography variant="body2" my={1}>
              {transferInstructionsMessage3}
            </Typography>
            <Typography variant="body2" mb={1}>
              {transferInstructionsMessage4}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DepositsSelectors;
