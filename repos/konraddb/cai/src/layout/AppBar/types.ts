export enum MainMenuItemProps {
  data = "data",
  measure = "measure",
}

export enum MenuItemProps {
  language = "language",
  numberFormat = "numberFormat",
  fiatEstimation = "fiatEstimation",
  account = "account",
  wallet = "wallet",
  orders = "orders",
  logout = "logout",
  languageDefault = "languageDefault",
  comma = "comma",
  period = "period",
}

export type AppBarProps = {
  loggedIn?: boolean;
  onHamburgerMenuSelect?: (values: string[]) => void;
  onLoginClick?: () => void;
  onContactClick?: () => void;
};
