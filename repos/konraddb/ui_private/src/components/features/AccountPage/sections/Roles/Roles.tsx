import Box from "@mui/material/Box";

import { SubpageHeader } from "@/components/molecules/SubpageHeader";

import { namespace } from "./config";
import { containerStyle } from "./Roles.styles";
import { UsersList } from "./sections/UsersList";
import { useRoles } from "./useRoles";
import { useRolesTranslations } from "./useRolesTranslations";

const Roles = () => {
  const { inviteEnabled, handleSendInvite } = useRoles();

  const { account, roles, rolesDescription, sendInvite } =
    useRolesTranslations(namespace);

  return (
    <Box sx={containerStyle}>
      <SubpageHeader
        label={account}
        title={roles}
        subtitle={rolesDescription}
        buttonLabel={sendInvite}
        disabled={!inviteEnabled}
        handleButtonClick={handleSendInvite}
      />

      <UsersList />
    </Box>
  );
};
export default Roles;
