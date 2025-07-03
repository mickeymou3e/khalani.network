export type MenuItemProp = {
  label: string;
  value: string;
  icon?: React.ReactNode;
  items?: MenuItemProp[];
};

export type AppBarMenuProps = {
  items: MenuItemProp[];
  menuIcon: React.ReactNode;
  align?: "left" | "right";
  maxHeight?: number | string;
  onSelect?: (value: string[]) => void;
};
