import Box from "@mui/material/Box";

import { Sidenav } from "@/components/molecules/Sidenav";
import { AppLayout } from "@/components/organisms";
import { WalletPageTabs } from "@/definitions/types";

import { Addresses } from "./sections/Addresses";
import { Banks } from "./sections/Banks";
import { Deposits } from "./sections/Deposits";
import { Overview } from "./sections/Overview";
import { Withdrawals } from "./sections/Withdrawals";
import { useWalletPage } from "./useWalletPage";
import { walletPageStyles } from "./WalletPage.styles";

const WalletPage = () => {
  const { isLoggedIn, sidenavContent, isAdmin, selectedTab, setSelectedTab } =
    useWalletPage();

  // TODO: Add route guards for this an Wallet pages
  if (!isLoggedIn) return null;

  return (
    <AppLayout>
      <Box sx={walletPageStyles}>
        {isAdmin && (
          <Sidenav
            content={sidenavContent}
            handleClick={setSelectedTab}
            selectedTab={selectedTab}
          />
        )}

        {selectedTab === WalletPageTabs.portfolio && (
          <Overview setSelectedTab={setSelectedTab} />
        )}

        {isAdmin && (
          <>
            {selectedTab === WalletPageTabs.deposits && <Deposits />}
            {selectedTab === WalletPageTabs.withdrawals && <Withdrawals />}
            {selectedTab === WalletPageTabs.addresses && <Addresses />}
            {selectedTab === WalletPageTabs.banks && <Banks />}
          </>
        )}
      </Box>
    </AppLayout>
  );
};

export default WalletPage;
