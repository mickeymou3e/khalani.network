import { BigNumber } from 'ethers'

export enum MetamaskActions {
  requestAccounts = 'eth_accounts',
  requestWallet = 'eth_requestAccounts',
  watchAsset = 'wallet_watchAsset',
  switchNetwork = 'wallet_switchEthereumChain',
  addNetwork = 'wallet_addEthereumChain',
}

export const MAX_BIG_NUMBER = BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
)
