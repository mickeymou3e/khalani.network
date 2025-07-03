import { useRouter } from "next/router";

import { Box } from "@mui/material";

import {
  FixedSnackbarContainer,
  MainSnackbarContainer,
  NotificationContainer,
} from "@/components/organisms";
import { DltLogo } from "@/components/organisms/AppLayout/DltLogo";
import {
  AccountPageTabs,
  Backdrops,
  WalletPageTabs,
} from "@/definitions/types";
import { api } from "@/services/api";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectIsValidLogin } from "@/store/auth";
import { handleLogout } from "@/store/auth/auth.store";
import { selectIsCurrentBackdropOpened } from "@/store/backdrops/backdrops.selectors";
import { openBackdrop } from "@/store/backdrops/backdrops.store";
import { setActiveAccountTab, setActiveWalletTab } from "@/store/ui/ui.store";

import { AppBar, MenuItemProps } from "../AppBar";
import { contentStyle, layoutContainerStyle } from "./AppLayout.styles";

export type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isLoggedIn = useAppSelector(selectIsValidLogin);
  const isBackdropOpen = useAppSelector(selectIsCurrentBackdropOpened);

  const onLoginClick = () => {
    dispatch(openBackdrop(Backdrops.LOGIN));
  };

  /**
   * TODO: This is a temporary solution to handle the navigation
   */
  const onHamburgerMenuSelect = ([topNavItem, subNavItem]: string[]) => {
    if (topNavItem.includes(MenuItemProps.logout)) {
      dispatch(api.util.resetApiState());
      dispatch(handleLogout());
      return;
    }

    const isWalletPageRelated = Object.values(WalletPageTabs).includes(
      subNavItem as WalletPageTabs
    );
    const isAccountPageRelated = Object.values(AccountPageTabs).includes(
      subNavItem as AccountPageTabs
    );

    router.push(topNavItem);

    isWalletPageRelated && dispatch(setActiveWalletTab(subNavItem));
    isAccountPageRelated && dispatch(setActiveAccountTab(subNavItem));
  };

  const handleContactClick = () => {
    dispatch(openBackdrop(Backdrops.CONTACT_US));
  };

  return (
    <Box sx={layoutContainerStyle(isBackdropOpen)}>
      <AppBar
        onLoginClick={onLoginClick}
        onContactClick={handleContactClick}
        loggedIn={isLoggedIn}
        onHamburgerMenuSelect={onHamburgerMenuSelect}
      />
      <MainSnackbarContainer />
      <FixedSnackbarContainer />
      <NotificationContainer />
      <Box sx={contentStyle}>{children}</Box>
      <DltLogo />
    </Box>
  );
};

export default AppLayout;
