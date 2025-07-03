import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {
  AppBar as MuiAppBar,
  Box,
  ButtonBase,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
} from "@mui/material";

import {
  buttonGroupStyle,
  leftPartStyle,
  rightPartStyle,
  toolbarStyle,
} from "./AppBar.styles";
import { AppBarMenu } from "./AppBarMenu";
import { AppBarProps } from "./types";
import useAppBar from "./useAppBar";
import NeutralLogo from "@/icons/NeutralLogo";
import { Button } from "@/components/Button";

const AppBar = ({
  loggedIn = false,
  onHamburgerMenuSelect,
  onLoginClick,
}: AppBarProps) => {
  const {
    mainMenuItems,
    hamburgerMenuItems,
    route,
    otherLabels,
    isMobile,
    isLoginPage,
    handleMainMenuChange,
    handleLogoClick,
  } = useAppBar();

  if (isMobile) {
    return <></>;
  }

  return (
    <MuiAppBar position="static">
      <Toolbar sx={toolbarStyle} disableGutters>
        <Box sx={leftPartStyle}>
          <ButtonBase onClick={handleLogoClick}>
            <NeutralLogo />
          </ButtonBase>
          {!isLoginPage && (
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
          )}
        </Box>
        {!isLoginPage && (
          <Box sx={rightPartStyle}>
            {loggedIn && (
              <AppBarMenu
                menuIcon={<PersonOutlineOutlinedIcon />}
                items={hamburgerMenuItems}
                onSelect={onHamburgerMenuSelect}
              />
            )}
            {!loggedIn && (
              <>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={onLoginClick}
                  data-testid="login-button"
                >
                  {otherLabels.login}
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;
