export interface Wallet {
  name: string
  type: WalletType
}

export enum WalletType {
  METAMASK = 'metamask',
  WALLETCONNECT = 'walletconnect',
}
