import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import DynamicFeedSharpIcon from "@mui/icons-material/DynamicFeedSharp";
import PieChartOutlineSharpIcon from "@mui/icons-material/PieChartOutlineSharp";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";

import { SidenavTab } from "@/components/molecules/Sidenav/Sidenav";
import { WalletPageTabs } from "@/definitions/types";

export const namespace = "main-menu:appBar:wallet";

export const createWalletSidenavConfig = (t: TFunc): SidenavTab[] => [
  {
    label: t(`${namespace}:portfolio`),
    value: WalletPageTabs.portfolio,
    icon: <PieChartOutlineSharpIcon />,
  },
  {
    label: t(`${namespace}:deposits`),
    value: WalletPageTabs.deposits,
    icon: <SavingsOutlinedIcon />,
  },
  {
    label: t(`${namespace}:withdrawals`),
    value: WalletPageTabs.withdrawals,
    icon: <DynamicFeedSharpIcon />,
  },
  {
    label: t(`${namespace}:addresses`),
    value: WalletPageTabs.addresses,
    icon: <QrCodeScannerOutlinedIcon />,
  },
  {
    label: t(`${namespace}:banks`),
    value: WalletPageTabs.banks,
    icon: <AccountBalanceOutlinedIcon />,
  },
];
