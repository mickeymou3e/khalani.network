import { Box } from "@mui/material";

import { AppBar } from "../AppBar";
import { contentStyle, layoutContainerStyle } from "./AppLayout.styles";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { AppRoutes } from "@/config/routes";

export type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const { isAuthenticated, logout } = useAuth0();
  const router = useRouter();

  const isBackdropOpen = false;

  const onLoginClick = () => router.push(AppRoutes.LOGIN);
  const onHamburgerMenuSelect = async (values: string[]) => {
    if (values.includes(AppRoutes.LOGOUT)) {
      logout();
    }
  };

  return (
    <Box sx={layoutContainerStyle(isBackdropOpen)}>
      <AppBar
        onLoginClick={onLoginClick}
        loggedIn={isAuthenticated}
        onHamburgerMenuSelect={onHamburgerMenuSelect}
      />
      <Box sx={contentStyle}>{children}</Box>
    </Box>
  );
};

export default AppLayout;
