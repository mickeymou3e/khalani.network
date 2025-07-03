import { createSlice } from "@reduxjs/toolkit";

import { defaultBaseAsset, defaultQuoteAsset } from "@/definitions/config";
import {
  AccountPageTabs,
  EcoAssets,
  ExecutionSide,
  OrderType,
  WalletPageTabs,
  WalletPorfolioTabs,
} from "@/definitions/types";

import { HoldingsActionTypes, UISlice } from "./ui.types";

export const initialState: UISlice = {
  trade: {
    base: defaultBaseAsset.code,
    quote: defaultQuoteAsset.code,
    holdings: {
      selected: HoldingsActionTypes.Orders,
      hideZeroBalances: false,
      searchText: "",
      pageSize: 10,
    },
    ticket: {
      orderType: OrderType.MARKET,
      side: ExecutionSide.BUY,
    },
  },
  wallet: {
    hideValues: false,
    pageSize: 10,
    activeTab: WalletPageTabs.portfolio,
    activePortfolioTab: WalletPorfolioTabs.pool,
  },
  account: {
    hideValues: false,
    pageSize: 10,
    activeTab: AccountPageTabs.profile,
  },
  auxilliary: {
    pageSize: 10,
    ecoAssetType: EcoAssets.Recs,
  },
  modal: {
    variant: null,
    params: null,
  },
  offline: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    changeSelectedAsset: (state, { payload: { base, quote } }) => {
      state.trade.base = base;
      state.trade.quote = quote;
    },
    changeSelectedHolding: (state, { payload }) => {
      state.trade.holdings.selected = payload;
    },
    changeHideZeroBalances: (state, { payload }) => {
      state.trade.holdings.hideZeroBalances = payload;
    },
    changeSearchText: (state, { payload }) => {
      state.trade.holdings.searchText = payload;
    },
    changePageSize: (state, { payload }) => {
      state.trade.holdings.pageSize = payload;
    },
    changeOrderType: (state, { payload }) => {
      state.trade.ticket.orderType = payload;
    },
    changeExecutionSide: (state, { payload }) => {
      state.trade.ticket.side = payload;
    },
    changeHidePortfolioValues: (state, { payload }) => {
      state.wallet.hideValues = payload;
    },
    changeHideAccountValues: (state, { payload }) => {
      state.account.hideValues = payload;
    },
    changeWalletPageSize: (state, { payload }) => {
      state.wallet.pageSize = payload;
    },
    changeAccountPageSize: (state, { payload }) => {
      state.account.pageSize = payload;
    },
    changeAuxilliaryPageSize: (state, { payload }) => {
      state.auxilliary.pageSize = payload;
    },
    setActiveAccountTab: (state, { payload }) => {
      state.account.activeTab = payload;
    },
    setActiveWalletTab: (state, { payload }) => {
      state.wallet.activeTab = payload;
    },
    setActivePortfolioTab: (state, { payload }) => {
      state.wallet.activePortfolioTab = payload;
    },
    changeOfflineStatus: (state, { payload }) => {
      state.offline = payload;
    },
    setEcoAssetType: (state, { payload }) => {
      state.auxilliary.ecoAssetType = payload;
    },
    openModal: (state, { payload }) => {
      state.modal.variant = payload;
    },
    setModalParams: (state, { payload }) => {
      state.modal.params = payload;
    },
    closeModal: (state) => {
      state.modal.variant = null;
      state.modal.params = null;
    },
  },
});

const { reducer } = uiSlice;

export const {
  changeSelectedAsset,
  changeSelectedHolding,
  changeHideZeroBalances,
  changeOrderType,
  changeExecutionSide,
  changeHidePortfolioValues,
  changeSearchText,
  changePageSize,
  changeHideAccountValues,
  changeWalletPageSize,
  changeAccountPageSize,
  changeAuxilliaryPageSize,
  setActiveAccountTab,
  setActiveWalletTab,
  setActivePortfolioTab,
  changeOfflineStatus,
  setEcoAssetType,
  openModal,
  setModalParams,
  closeModal,
} = uiSlice.actions;

export { reducer as uiReducer };
