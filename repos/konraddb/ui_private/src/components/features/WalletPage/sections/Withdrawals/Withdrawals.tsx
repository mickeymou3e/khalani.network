import Box from "@mui/material/Box";

import { SubpageHeader } from "@/components/molecules/SubpageHeader";

import { namespace } from "./config";
import { CryptoWithdrawSummary } from "./sections/CryptoWithdrawSummary";
import { FiatWithdrawSummary } from "./sections/FiatWithdrawSummary";
import { WithdrawalsSelectors } from "./sections/WithdrawalsSelectors";
import { WithdrawHistory } from "./sections/WithdrawHistory";
import { useWalletWithdrawalTranslations } from "./useWalletWithdrawalTranslations";
import { useWithdrawals } from "./useWithdrawals";
import { containerStyle, contentWrapperGridStyles } from "./Withdrawal.styles";

const Withdrawals = () => {
  const { formik, isFiat } = useWithdrawals();
  const { wallet, pageTitle } = useWalletWithdrawalTranslations(namespace);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={containerStyle}>
        <SubpageHeader label={wallet} title={pageTitle} />

        <Box sx={contentWrapperGridStyles}>
          <WithdrawalsSelectors formik={formik} />

          {isFiat ? (
            <FiatWithdrawSummary formik={formik} />
          ) : (
            <CryptoWithdrawSummary formik={formik} />
          )}
        </Box>

        <WithdrawHistory />
      </Box>
    </form>
  );
};

export default Withdrawals;
