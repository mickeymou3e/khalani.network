import { IUSDAmount, TokenModelBalance } from '@interfaces/core'

export interface ITokenSelectorInputProps {
  tokens: TokenModelBalance[]
  selectedToken?: TokenModelBalance
  amount?: bigint
  maxAmount?: bigint
  disabled?: boolean
  displayMaxAmount?: boolean
  onAmountChange?: (amount: bigint | undefined) => void
  error?: boolean
  onTokenChange?: (token: TokenModelBalance) => void
  usdAmount?: IUSDAmount
}

export interface ITokenSelectorBalance {
  tokenId: string
  balance: bigint
}
