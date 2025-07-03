import Image from "next/image";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { StaticRoutes } from "@/definitions/config";
import { UserRole } from "@/definitions/types";

import { namespace } from "../../config";
import { useRolesTranslations } from "../../useRolesTranslations";
import { containerStyle } from "./UsersList.styles";
import { useUsersList } from "./useUsersList";

const UsersList = () => {
  const { appUsers } = useUsersList();

  const { accountHolder, members, role, mail } =
    useRolesTranslations(namespace);

  return (
    <Box>
      <Typography variant="subtitle" color="primary.gray2" mb={3}>
        {members}
      </Typography>

      {appUsers.map((user) => (
        <Box sx={containerStyle} width="100%" key={`user-${user.code}`}>
          <Image
            src={
              user.role === UserRole.Admin
                ? StaticRoutes.USER_ADMIN
                : StaticRoutes.USER_TRADER
            }
            alt="user-image"
            width="72"
            height="72"
          />

          <Box>
            <Typography variant="body3" color="primary.gray2">
              {accountHolder}
            </Typography>
            <Typography variant="body2" mt={1} fontWeight="medium">
              {user.name}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body3" color="primary.gray2">
              {role}
            </Typography>
            <Typography
              variant="body2"
              mt={1}
              fontWeight="medium"
              sx={{
                textTransform: "capitalize",
              }}
            >
              {user.role}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body3" color="primary.gray2">
              {mail}
            </Typography>
            <Typography variant="body2" mt={1} fontWeight="medium">
              {user.email}
            </Typography>
          </Box>

          <Box />

          {/* Note: That section is only temporarily hidden, it will be needed in the future. */}
          {/* <Button
            variant="translucent"
            size="small"
            onClick={handleActionButton}
            disabled={user.role === "admin"}
          >
            {changeRole}
          </Button> */}
        </Box>
      ))}
    </Box>
  );
};

export default UsersList;
