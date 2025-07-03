import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { appWithTranslation } from "next-i18next";
import { PersistGate } from "redux-persist/integration/react";

import { CssBaseline, ThemeProvider } from "@mui/material";

import { SupportBackdrop } from "@/components/features";
import { CreateNewApiKeyBackdrop } from "@/components/features/AccountPage/sections/ApiKeys/CreateBackdrop";
import { DeleteApiKeyBackdrop } from "@/components/features/AccountPage/sections/ApiKeys/DeleteBackdrop";
import { InviteUserBackdrop } from "@/components/features/AccountPage/sections/Roles/sections/InviteUserBackdrop";
import { LoginBackdrop } from "@/components/features/Authentication/LoginBackdrop";
import { RequestDepositBackdrop as RequestPoolDepositBackdrop } from "@/components/features/PoolPage/Deposit";
import { CancelOrdersBackdrop } from "@/components/features/TradePage/Holdings/Orders/CancelOrdersBackdrop";
import { DeleteAddressBackdrop } from "@/components/features/WalletPage/sections/Backdrops/DeleteAddressBackdrop";
import { RequestWhitelistAddressBackdrop } from "@/components/features/WalletPage/sections/Backdrops/RequestWhitelistAddressBackdrop";
import { RequestWithdrawalBackdrop } from "@/components/features/WalletPage/sections/Backdrops/RequestWithdrawalBackdrop";
import { NeutralBackdrop } from "@/components/organisms/Backdrop";
import { useAuth } from "@/hooks/auth";
import { useDetectNetworkError } from "@/hooks/network";
import { useDefiStrategyCreation } from "@/hooks/strategy";
import {
  useNeutralWebsocketSubscriptions,
  useWebsocketSubscriptions,
} from "@/hooks/subscriptions";
import { useResetRequestStatus } from "@/hooks/useResetRequestStatus";
import { useVersionCheck } from "@/hooks/useVersionCheck";
import { useWalletCreation, useWalletSubscriptions } from "@/hooks/wallet";
import { persistor, store } from "@/store";
import { lightTheme } from "@/styles/themes";

import "@/styles/globalOverrides.css";
import "flag-icons/css/flag-icons.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Backdrops } from "../definitions/types";

const backdropsMapper = {
  [Backdrops.LOGIN]: LoginBackdrop,
  [Backdrops.CREATE_NEW_API_KEY]: CreateNewApiKeyBackdrop,
  [Backdrops.DELETE_API_KEY]: DeleteApiKeyBackdrop,
  [Backdrops.CONTACT_US]: SupportBackdrop,

  [Backdrops.REQUEST_WITHDRAWAL]: RequestWithdrawalBackdrop,

  [Backdrops.REQUEST_POOL_DEPOSIT]: RequestPoolDepositBackdrop,

  [Backdrops.REQUEST_WHITELIST_ADDRESS]: RequestWhitelistAddressBackdrop,
  [Backdrops.DELETE_ADDRESS]: DeleteAddressBackdrop,

  [Backdrops.CANCEL_ORDERS]: CancelOrdersBackdrop,

  //  Note: That line is only temporarily hidden, it will be needed in the future.
  // [Backdrops.CHANGE_ROLE_BACKDROP]: ChangeRoleBackdrop,
  [Backdrops.INVITE_USER_BACKDROP]: InviteUserBackdrop,
};

const App = ({ Component, pageProps }: AppProps) => {
  useAuth();
  useWebsocketSubscriptions();
  useNeutralWebsocketSubscriptions();
  useDefiStrategyCreation();
  useWalletCreation();
  useResetRequestStatus();
  useDetectNetworkError();
  useWalletSubscriptions();
  useVersionCheck();

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Component {...pageProps} />
      <NeutralBackdrop backdropsMapper={backdropsMapper} />
    </ThemeProvider>
  );
};

const AppWithStore = (props: AppProps) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App {...props} />
    </PersistGate>
  </Provider>
);

export default appWithTranslation(AppWithStore);
