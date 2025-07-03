import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import { namespace as accountNamespace } from "@/components/features/AccountPage/config";
import { namespace as walletNamespace } from "@/components/features/WalletPage/config";
import { tradedPairs } from "@/definitions/config";
import useBreakpoints from "@/hooks/useBreakpoints";
import { useAppSelector } from "@/store";
import { selectIsAdminUser } from "@/store/account";
import { selectFirstAsset } from "@/store/assets";

import {
  createHamburgerMenuItems,
  createMainMenuItems,
  createOtherLabels,
  namespace,
} from "./config";
import { MainMenuItemProps } from "./types";

const useAppBar = () => {
  const router = useRouter();
  const [route, setRoute] = useState("");
  const { t } = useTranslation(namespace);
  const { t: tWallet } = useTranslation(walletNamespace);
  const { t: tAccount } = useTranslation(accountNamespace);
  const firstAsset = useAppSelector(selectFirstAsset);
  const mainMenuItems = createMainMenuItems(
    t,
    firstAsset?.pair || tradedPairs[0].pair
  );
  const isAdmin = useAppSelector(selectIsAdminUser);
  const { tabletLandscape } = useBreakpoints();
  const hamburgerMenuItems = createHamburgerMenuItems(
    t,
    tWallet,
    tAccount,
    tabletLandscape,
    isAdmin
  );
  const otherLabels = createOtherLabels(t);

  useEffect(() => {
    setRoute(router.asPath);
  }, [router.asPath]);

  const handleMainMenuChange = (_: unknown, val: MainMenuItemProps) => {
    if (!val) return;

    setRoute(val);
    router.push(val);
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  return {
    mainMenuItems,
    hamburgerMenuItems,
    route,
    otherLabels,
    handleLogoClick,
    handleMainMenuChange,
  };
};

export default useAppBar;
