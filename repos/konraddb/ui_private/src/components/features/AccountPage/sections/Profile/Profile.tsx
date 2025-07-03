import Box from "@mui/material/Box";

import { SubpageHeader } from "@/components/molecules";

import { containerStyle, contentWrapper } from "./Profile.styles";
import CompanyInformation from "./sections/CompanyInformation/CompanyInformation";
import { UserInformation } from "./sections/UserInformation";
import { useProfile } from "./useProfile";

const Profile = () => {
  const { accountLabel, profileLabel } = useProfile();

  return (
    <Box sx={containerStyle}>
      <SubpageHeader label={accountLabel} title={profileLabel} />

      <Box sx={contentWrapper}>
        <UserInformation />
        <CompanyInformation />
      </Box>
    </Box>
  );
};

export default Profile;
