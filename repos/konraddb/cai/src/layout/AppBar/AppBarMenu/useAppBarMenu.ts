import { useState } from "react";
import { useRouter } from "next/router";

import { MenuItemProps } from "../types";
import { MenuItemProp } from "./types";

const useAppBarMenu = (
  items: MenuItemProp[],
  onSelect: (value: string[]) => void
) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentLevelItems, setCurrentLevelItems] = useState(items);
  const [parentItem, setParentItem] = useState<MenuItemProp | null>(null);
  const isMenuSelected = [MenuItemProps.wallet, MenuItemProps.account].includes(
    router.route.replace("/", "") as MenuItemProps
  );

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setParentItem(null);
    setCurrentLevelItems(items);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBackClick = () => {
    setCurrentLevelItems(items);
    setParentItem(null);
  };

  const handleItemClick = (item: MenuItemProp) => () => {
    if (item.items) {
      setCurrentLevelItems(item.items);
      setParentItem(item);
    } else {
      onSelect(parentItem ? [parentItem.value, item.value] : [item.value]);
      handleClose();
    }
  };

  return {
    anchorEl,
    currentLevelItems,
    parentItem,
    isMenuSelected,
    handleOpen,
    handleClose,
    handleBackClick,
    handleItemClick,
  };
};

export default useAppBarMenu;
