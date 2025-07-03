export interface IReceiveBoxProps {
  amount: number
  tokenSymbol: string
  chainLogo?: string
  additionalData?: { tokenSymbol: string; amount: number } | undefined
}
