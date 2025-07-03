import { LogoutOutlined, PersonOutlineOutlined } from "@mui/icons-material";

import { MenuItemProp } from "./AppBarMenu";
import { MainMenuItemProps, MenuItemProps } from "./types";

export const namespace = "main-menu";

const createLabelValue = (key: string, extension = "") => ({
  label: key,
  value: `/${key}${extension ? `/${extension}` : ""}`,
});

export const createMainMenuItems = () => {
  return [
    createLabelValue(MainMenuItemProps.data),
    createLabelValue(MainMenuItemProps.measure),
  ];
};

export const createHamburgerMenuItems = (): MenuItemProp[] => [
  {
    ...createLabelValue(MenuItemProps.account),
    icon: <PersonOutlineOutlined />,
  },
  {
    ...createLabelValue(MenuItemProps.logout),
    icon: <LogoutOutlined />,
  },
];

export const createOtherLabels = () => ({
  login: "Login",
});
