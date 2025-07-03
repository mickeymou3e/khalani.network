import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { SidenavTab } from "@/components/molecules/Sidenav/Sidenav";
import { AccountPageTabs } from "@/definitions/types";

export const namespace = "main-menu:appBar:account";

export const createAccountSidenavConfig = (t: TFunc): SidenavTab[] => [
  {
    label: t(`${namespace}:profile`),
    value: AccountPageTabs.profile,
    icon: <PersonOutlineOutlinedIcon />,
  },
  {
    label: t(`${namespace}:roles`),
    value: AccountPageTabs.roles,
    icon: <PeopleAltOutlinedIcon />,
  },
  //  Note: That section is only temporarily hidden, it will be needed in the future.
  // {
  //   label: t(`${namespace}:apiKeys`),
  //   value: AccountPageTabs.apiKeys,
  //   icon: <VpnKeyOutlinedIcon />,
  // },
];
