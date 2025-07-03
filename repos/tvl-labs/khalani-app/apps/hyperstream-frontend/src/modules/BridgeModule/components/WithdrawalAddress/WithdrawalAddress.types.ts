export interface IWithdrawalAddressProps {
  destinationChainName: string | undefined
  onAddressChange: (address: string) => void
}
