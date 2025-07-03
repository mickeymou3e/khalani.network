import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";

export const selectTradeSettings = (state: RootState) => state.ui.trade;

export const selectSelectedPair = createSelector(
  selectTradeSettings,
  (settings) => ({
    base: settings.base,
    quote: settings.quote,
    pair: `${settings.base}/${settings.quote}`,
  })
);

export const selectSelectedHolding = (state: RootState) =>
  state.ui.trade.holdings.selected;

export const selectHideZeroBalances = (state: RootState) =>
  state.ui.trade.holdings.hideZeroBalances;

export const selectSearchText = (state: RootState) =>
  state.ui.trade.holdings.searchText;

export const selectPageSize = (state: RootState) =>
  state.ui.trade.holdings.pageSize;

export const selectSelectedTicketValues = (state: RootState) =>
  state.ui.trade.ticket;

export const selectHidePortfolioValues = (state: RootState) =>
  state.ui.wallet.hideValues;

export const selectHideAccountValues = (state: RootState) =>
  state.ui.account.hideValues;

export const selectWalletPageSize = (state: RootState) =>
  state.ui.wallet.pageSize;

export const selectAccountPageSize = (state: RootState) =>
  state.ui.account.pageSize;

export const selectAuxilliaryPageSize = (state: RootState) =>
  state.ui.auxilliary.pageSize;

export const selectActiveAccountTab = (state: RootState) =>
  state.ui.account.activeTab;

export const selectActiveWalletTab = (state: RootState) =>
  state.ui.wallet.activeTab;

export const selectActivePortfolioTab = (state: RootState) =>
  state.ui.wallet.activePortfolioTab;

export const selectOfflineStatus = (state: RootState) => state.ui.offline;

export const selectEcoAssetType = (state: RootState) =>
  state.ui.auxilliary.ecoAssetType;

export const selectModalProps = (state: RootState) => state.ui.modal;
