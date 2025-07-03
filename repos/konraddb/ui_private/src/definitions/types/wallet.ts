export enum WalletPageTabs {
  portfolio = "portfolio",
  deposits = "deposits",
  withdrawals = "withdrawals",
  addresses = "addresses",
  banks = "banks",
}

export enum WalletPorfolioTabs {
  pool = "pool",
  underlyings = "underlyings",
  fiat = "fiat",
}

export enum AddressState {
  pending_sign = "pending_sign",
  pending_admin_approve = "pending_admin_approve",
  pending_admin_delete = "pending_admin_delete",
  approved = "approved",
  pending_aml = "pending_aml",
}
