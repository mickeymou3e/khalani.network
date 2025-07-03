import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import {
  AppBar as MuiAppBar,
  Box,
  ButtonBase,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from "@mui/material";

import { Button, IconButton, NeutralLogo } from "@/components/atoms";

import {
  buttonGroupStyle,
  leftPartStyle,
  rightPartStyle,
  toolbarStyle,
} from "./AppBar.styles";
import { AppBarMenu } from "./AppBarMenu";
import { AppBarProps } from "./types";
import useAppBar from "./useAppBar";

const AppBar = ({
  loggedIn = false,
  onHamburgerMenuSelect,
  onLoginClick,
  onContactClick,
}: AppBarProps) => {
  const {
    mainMenuItems,
    hamburgerMenuItems,
    route,
    otherLabels,
    handleMainMenuChange,
    handleLogoClick,
  } = useAppBar();

  return (
    <MuiAppBar position="static">
      <Toolbar sx={toolbarStyle} disableGutters>
        <Box sx={leftPartStyle}>
          <ButtonBase onClick={handleLogoClick}>
            <NeutralLogo />
          </ButtonBase>
          <ToggleButtonGroup
            sx={buttonGroupStyle}
            value={route}
            onChange={handleMainMenuChange}
            exclusive
          >
            {mainMenuItems.map((item) => (
              <ToggleButton key={item.value} value={item.value}>
                {item.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        <Box sx={rightPartStyle}>
          <IconButton size="medium" onClick={onContactClick}>
            <SmsOutlinedIcon />
          </IconButton>
          {loggedIn && (
            <AppBarMenu
              menuIcon={<PersonOutlineOutlinedIcon />}
              items={hamburgerMenuItems}
              onSelect={onHamburgerMenuSelect}
            />
          )}
          {!loggedIn && (
            <Button size="medium" variant="contained" onClick={onLoginClick}>
              {otherLabels.login}
            </Button>
          )}
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
