import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";

import { MenuItemProps } from "../types";
import {
  backButtonStyle,
  iconButtonStyle,
  listItemStyles,
  menuStyle,
  popperStyle,
} from "./AppBarMenu.styles";
import { AppBarMenuProps, MenuItemProp } from "./types";
import useAppBarMenu from "./useAppBarMenu";
import { IconButton } from "@/components/IconButton";
import { Button } from "@/components/Button";

const AppBarMenu = ({
  items = [],
  menuIcon,
  align = "right",
  maxHeight = "25rem",
  onSelect = () => {},
}: AppBarMenuProps) => {
  const {
    anchorEl,
    currentLevelItems,
    parentItem,
    isMenuSelected,
    handleOpen,
    handleClose,
    handleBackClick,
    handleItemClick,
  } = useAppBarMenu(items, onSelect);

  return (
    <>
      <IconButton
        sx={iconButtonStyle(isMenuSelected)}
        variant={isMenuSelected ? "translucent" : "text"}
        size="medium"
        onClick={handleOpen}
      >
        {menuIcon}
      </IconButton>
      <Popover
        sx={popperStyle(maxHeight)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: align,
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: align,
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {parentItem && (
          <Button
            sx={backButtonStyle}
            variant="text"
            size="large"
            disableRipple
            startIcon={<KeyboardArrowLeftIcon />}
            onClick={handleBackClick}
          >
            {parentItem?.label}
          </Button>
        )}
        <MenuList sx={menuStyle}>
          {currentLevelItems.map((item: MenuItemProp) => (
            <MenuItem key={item.value} onClick={handleItemClick(item)}>
              {item.icon && (
                <ListItemIcon
                  sx={listItemStyles(item.value.includes(MenuItemProps.logout))}
                >
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText
                sx={listItemStyles(item.value.includes(MenuItemProps.logout))}
              >
                {item.label}
              </ListItemText>
              {item.items && (
                <ListItemIcon>
                  <KeyboardArrowRightIcon />
                </ListItemIcon>
              )}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
};

export default AppBarMenu;
