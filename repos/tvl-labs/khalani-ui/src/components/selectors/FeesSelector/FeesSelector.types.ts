export interface IFeesSelectorProps {
  fees: string[]
  selectedFee: string
  tokenSymbol: string
  isFixedFee?: boolean
  feeChangeFn: (fee: string) => void
  textFieldChangeFn?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
