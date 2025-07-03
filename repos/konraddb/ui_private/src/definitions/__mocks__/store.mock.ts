import React from "react";

import { AssetName } from "@/definitions/config";
import {
  AccountPageTabs,
  Backdrops,
  EcoAssets,
  ExecutionSide,
  FiatCurrencies,
  ModalVariants,
  NotificationPropsVariant,
  Notifications,
  OrderType,
  RequestStatusProps,
  SnackbarVariant,
  WalletPageTabs,
  WalletPorfolioTabs,
} from "@/definitions/types";
import { HoldingsActionTypes } from "@/store/ui/ui.types";

export const createJasmineMockApiInitialState = ({
  tokenMetadata = [],
  poolDeposits = [],
}: {
  tokenMetadata?: unknown[];
  poolDeposits?: unknown[];
}): any => ({
  queries: {
    "getTokenMetadata(undefined)": {
      data: tokenMetadata,
    },
    "getPoolDeposits(undefined)": {
      data: poolDeposits,
    },
  },
});

export const createMockApiInitialState = ({
  userProfile = {},
  assignedAssets = [],
  orders = [],
  rates = {},
  balances = [],
  apiTokens = [],
  customer = {},
  custodyWallets = [],
}: {
  userProfile?: unknown;
  assignedAssets?: unknown[];
  rates?: {
    BTC?: object;
    ETH?: object;
    ATOM?: object;
    "JLT-F23"?: object;
  };
  orders?: unknown[];
  balances?: unknown[];
  apiTokens?: unknown[];
  customer?: unknown;
  custodyWallets?: unknown[];
}): any => ({
  queries: {
    "getUserProfile(undefined)": {
      data: userProfile,
    },
    getAssignedAssets: {
      data: assignedAssets,
    },
    'ratesChannel("BTC/EUR")': {
      data: rates?.BTC,
    },
    'ratesChannel("ETH/EUR")': {
      data: rates?.ETH,
    },
    'ratesChannel("ATOM/EUR")': {
      data: rates?.ATOM,
    },
    'ratesChannel("JLT-F23/EUR")': {
      data: rates?.["JLT-F23"],
    },
    "getOrders(undefined)": {
      data: {
        records: orders,
      },
    },
    getBalances: {
      data: balances,
    },
    "getApiTokens(undefined)": {
      data: {
        records: apiTokens,
      },
    },
    "getCryptoDepositsAddressess('b4137ae0-e941-45b2-a9c3-9f1c16f49428')": {
      data: custodyWallets,
    },
    getCustomer: {
      data: customer,
    },
  },
});

export const createMockUiInitialState = ({
  base = AssetName["JLT-F23"],
  quote = FiatCurrencies.EUR,
  selectedHolding = HoldingsActionTypes.Orders,
  hideZeroBalances = false,
  searchText = "",
  pageSize = 10,
  orderType = OrderType.MARKET,
  side = ExecutionSide.BUY,
  hideValues = false,
  wallet = {
    hideValues: false,
    pageSize: 10,
    activeTab: WalletPageTabs.portfolio,
    activePortfolioTab: WalletPorfolioTabs.pool,
  },
  account = {
    hideValues: false,
    pageSize: 10,
    activeTab: AccountPageTabs.profile,
  },
  auxilliary = {
    pageSize: 10,
    ecoAssetType: EcoAssets.Recs,
  },
  modal = {
    variant: null,
    params: null,
  },
  offline = false,
}: {
  base?: string;
  quote?: string;
  selectedHolding?: HoldingsActionTypes;
  hideZeroBalances?: boolean;
  searchText?: string;
  pageSize?: number;
  orderType?: OrderType;
  side?: ExecutionSide;
  hideValues?: boolean;
  wallet?: {
    hideValues?: boolean;
    pageSize?: number;
    activeTab?: WalletPageTabs;
    activePortfolioTab?: WalletPorfolioTabs;
  };
  account?: {
    hideValues?: boolean;
    pageSize?: number;
    activeTab?: AccountPageTabs;
  };
  auxilliary?: {
    pageSize?: number;
    ecoAssetType: EcoAssets;
  };
  modal?: {
    variant?: ModalVariants | string | null;
    params?: any | null;
  };
  offline?: boolean;
}) => ({
  trade: {
    base,
    quote,
    holdings: {
      selected: selectedHolding,
      hideZeroBalances,
      searchText,
      pageSize,
    },
    ticket: {
      orderType,
      side,
    },
  },
  wallet: {
    hideValues: wallet.hideValues ?? hideValues,
    pageSize: wallet.pageSize ?? pageSize,
    activeTab: WalletPageTabs.portfolio,
    activePortfolioTab: wallet.activePortfolioTab ?? WalletPorfolioTabs.pool,
  },
  account: {
    hideValues: account.hideValues ?? hideValues,
    pageSize: account.pageSize ?? pageSize,
    activeTab: AccountPageTabs.profile,
  },
  auxilliary: {
    pageSize: auxilliary.pageSize ?? pageSize,
    ecoAssetType: auxilliary.ecoAssetType,
  },
  modal: {
    variant: modal.variant ?? null,
    params: modal.params ?? null,
  },
  offline,
});

export const createMockNotificationsStore = ({
  id = 0,
  primaryText = "",
  secondaryText = "",
  fixedId = 0,
  text = "",
  buttonText = "",
  variant = SnackbarVariant.success,
  notifications = [],
  link = "",
  error = false,
}: {
  id?: number;
  primaryText?: string;
  secondaryText?: string;
  fixedId?: number;
  text?: string;
  buttonText?: string;
  variant?: SnackbarVariant;
  notifications?: {
    id: Notifications;
    primaryText: string;
    variant: NotificationPropsVariant;
    customChildren: React.ReactNode;
  }[];
  link?: string;
  error?: boolean;
}) => ({
  snackbar: {
    id,
    primaryText,
    secondaryText,
    variant,
    link,
  },
  fixedSnackbar: {
    buttonText,
    id: fixedId,
    text,
    error,
  },
  notifications: notifications.length ? notifications : [],
});

export const createMockBackdropsStore = ({
  currentBackdrop = null,
  parameters = null,
}: {
  currentBackdrop?: Backdrops | null;
  parameters?: any;
}) => ({
  currentBackdrop,
  parameters,
});

export const createMockAuthStore = ({
  csrfToken = "",
  loginToken = "",
  wsToken = "",
  errorCode = 0,
  isFullyLoggedIn = false,
}: {
  csrfToken?: string;
  loginToken?: string;
  wsToken?: string;
  errorCode?: number;
  isFullyLoggedIn?: boolean;
}): any => ({
  csrfToken,
  loginToken,
  wsToken,
  errorCode,
  isFullyLoggedIn,
});

export const createMockWalletStore = ({
  cryptoDepositAddresses = [],
}: {
  cryptoDepositAddresses?: unknown[];
}): any => ({
  cryptoDepositAddresses,
  fetchCryptoDepositAddressesStatus: RequestStatusProps.IDLE,
  depositsHistory: [],
  selectedAsset: "",
  selectedAssetDetails: null,
  cryptoWithdrawalAddresses: [],
  withdrawalsHistory: [],
  requestStatus: RequestStatusProps.IDLE,
});

export const createMockDispatch = () => (): any => ({
  unsubscribe: () => {},
});
