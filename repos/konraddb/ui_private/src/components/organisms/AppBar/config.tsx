import {
  AccountBalanceWalletOutlined,
  LogoutOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";

import { createAccountSidenavConfig } from "@/components/features/AccountPage/config";
import { createWalletSidenavConfig } from "@/components/features/WalletPage/config";

import { MenuItemProp } from "./AppBarMenu";
import { MainMenuItemProps, MenuItemProps } from "./types";

export const namespace = "main-menu";

const createLabelValue = (t: TFunc, key: string, extension = "") => ({
  label: t(`${namespace}:${key}`),
  value: `/${key}${extension ? `/${extension}` : ""}`,
});

export const createMainMenuItems = (t: TFunc, asset: string) => {
  const extension = asset.replace("/", "_") ?? "";

  return [
    createLabelValue(t, MainMenuItemProps.markets),
    createLabelValue(t, MainMenuItemProps.bridge),
    createLabelValue(t, MainMenuItemProps.pool),
    createLabelValue(t, MainMenuItemProps.trade, extension),
    createLabelValue(t, MainMenuItemProps.retire),
  ];
};

export const createHamburgerMenuItems = (
  t: TFunc,
  tWallet: TFunc,
  tAccount: TFunc,
  tabletLandscape: boolean,
  isAdmin: boolean
): MenuItemProp[] => [
  {
    ...createLabelValue(t, MenuItemProps.account),
    icon: <PersonOutlineOutlined />,
    items:
      tabletLandscape || !isAdmin
        ? undefined
        : createAccountSidenavConfig(tAccount),
  },
  {
    ...createLabelValue(t, MenuItemProps.wallet),
    label: t(`${namespace}:myAssets`),
    value: `/${MenuItemProps.wallet}`,
    icon: <AccountBalanceWalletOutlined />,
    items:
      tabletLandscape || !isAdmin
        ? undefined
        : createWalletSidenavConfig(tWallet),
  },
  {
    ...createLabelValue(t, MenuItemProps.logout),
    icon: <LogoutOutlined />,
  },
];

export const createOtherLabels = (t: TFunc) => ({
  login: t(`${namespace}:login`),
});
