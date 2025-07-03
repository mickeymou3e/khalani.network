import Box from "@mui/material/Box";

import { SubpageHeader } from "@/components/molecules/SubpageHeader";

import { namespace } from "./config";
import { containerStyle, contentWrapperGridStyles } from "./Deposit.styles";
import { CryptoDepositSummary } from "./sections/CryptoDepositSummary";
import { DepositHistory } from "./sections/DepositHistory";
import { DepositsSelectors } from "./sections/DepositsSelectors";
import { FiatDepositSummary } from "./sections/FiatDepositSummary";
import { useDeposits } from "./useDeposits";
import { useWalletDepositsTranslations } from "./useWalletDepositsTranslations";

const Deposits = () => {
  const { isFiat } = useDeposits();
  const { wallet, pageTitle } = useWalletDepositsTranslations(namespace);

  return (
    <Box sx={containerStyle}>
      <SubpageHeader label={wallet} title={pageTitle} />

      <Box sx={contentWrapperGridStyles}>
        <DepositsSelectors />

        {isFiat ? <FiatDepositSummary /> : <CryptoDepositSummary />}
      </Box>

      <DepositHistory />
    </Box>
  );
};

export default Deposits;
