export interface IAccountOverviewProps {
  accountAddress: string
  handleDisconnectWallet: () => void
  isFetchingBalances: boolean
  accountBalance?: bigint
}
