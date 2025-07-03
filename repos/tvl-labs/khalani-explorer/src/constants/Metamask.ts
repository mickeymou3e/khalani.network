export enum MetamaskActions {
  requestAccounts = 'eth_accounts',
  requestWallet = 'eth_requestAccounts',
  watchAsset = 'wallet_watchAsset',
  switchNetwork = 'wallet_switchEthereumChain',
  addNetwork = 'wallet_addEthereumChain',
}

export enum MetamaskErrors {
  UserRejected = 4001,
  AddNetworkFirst = 4902,
}
