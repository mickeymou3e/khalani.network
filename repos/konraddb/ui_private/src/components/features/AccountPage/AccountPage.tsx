import Box from "@mui/material/Box";

import { Sidenav } from "@/components/molecules/Sidenav";
import { AppLayout } from "@/components/organisms";
import { AccountPageTabs } from "@/definitions/types";

import { accountPageStyles } from "./AccountPage.styles";
import { Profile } from "./sections/Profile";
import { Roles } from "./sections/Roles";
import { useAccountPage } from "./useAccountPage";

const AccountPage = () => {
  const { isValidLogin, sidenavContent, isAdmin, selectedTab, setSelectedTab } =
    useAccountPage();

  if (!isValidLogin) return null;

  return (
    <AppLayout>
      <Box sx={accountPageStyles}>
        {isAdmin && (
          <Sidenav
            content={sidenavContent}
            handleClick={setSelectedTab}
            selectedTab={selectedTab}
          />
        )}

        {selectedTab === AccountPageTabs.profile && <Profile />}

        {isAdmin && (
          <>
            {selectedTab === AccountPageTabs.roles && <Roles />}
            {/* Note: That section is only temporarily hidden, it will be needed in the future. */}
            {/* {selectedTab === AccountPageTabs.apiKeys && <ApiKeys />} */}
          </>
        )}
      </Box>
    </AppLayout>
  );
};

export default AccountPage;
