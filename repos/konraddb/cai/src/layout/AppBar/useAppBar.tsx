import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import {
  createHamburgerMenuItems,
  createMainMenuItems,
  createOtherLabels,
} from "./config";
import { MainMenuItemProps } from "./types";
import { useIsMobile } from "@/hooks/responsive";
import { AppRoutes } from "@/config/routes";

const useAppBar = () => {
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";
  const [route, setRoute] = useState("");

  const isMobile = useIsMobile();

  const mainMenuItems = createMainMenuItems();
  const hamburgerMenuItems = createHamburgerMenuItems();
  const otherLabels = createOtherLabels();

  useEffect(() => {
    setRoute(router.asPath);
  }, [router.asPath]);

  const handleMainMenuChange = (_: unknown, val: MainMenuItemProps) => {
    if (!val) return;

    setRoute(val);
    router.push(val);
  };

  const handleLogoClick = () => {
    router.push(AppRoutes.DATA);
  };

  return {
    mainMenuItems,
    hamburgerMenuItems,
    route,
    otherLabels,
    isMobile,
    isLoginPage,
    handleLogoClick,
    handleMainMenuChange,
  };
};

export default useAppBar;
