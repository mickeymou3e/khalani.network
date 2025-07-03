import {
  AccountPageTabs,
  EcoAssets,
  ExecutionSide,
  ModalVariants,
  OrderType,
  WalletPageTabs,
  WalletPorfolioTabs,
} from "@/definitions/types";

export interface TicketValues {
  orderType: OrderType;
  side: ExecutionSide;
}

export interface UISlice {
  trade: {
    base: string;
    quote: string;
    holdings: {
      selected: HoldingsActionTypes;
      hideZeroBalances: boolean;
      searchText: string;
      pageSize: number;
    };
    ticket: TicketValues;
  };
  wallet: {
    hideValues: boolean;
    pageSize: number;
    activeTab: WalletPageTabs;
    activePortfolioTab: WalletPorfolioTabs;
  };
  account: {
    hideValues: boolean;
    pageSize: number;
    activeTab: AccountPageTabs;
  };
  auxilliary: {
    pageSize: number;
    ecoAssetType: EcoAssets;
  };
  modal: {
    variant: ModalVariants | string | null;
    params: any | null;
  };
  offline: boolean;
}

export enum HoldingsActionTypes {
  Orders = "orders",
  History = "history",
  Portfolio = "portfolio",
}
