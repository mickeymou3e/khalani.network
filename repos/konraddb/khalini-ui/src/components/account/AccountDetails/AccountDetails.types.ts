export interface IAccountDetailsProps {
  nativeTokenBalance: string
  isFetchingNativeTokenBalance?: boolean
  ethAddress: string
  chainId: number | null
  nativeTokenSymbol: string
  onAddressClick?: (address: string) => void
}
