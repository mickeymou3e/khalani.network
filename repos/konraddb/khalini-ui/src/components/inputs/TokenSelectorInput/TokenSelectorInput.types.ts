import { BigNumber } from 'ethers'

import { TokenModelBalanceWithIcon } from '@interfaces/core'

export interface ITokenSelectorInputProps {
  tokens: TokenModelBalanceWithIcon[]
  selectedToken?: TokenModelBalanceWithIcon
  amount?: BigNumber
  disabled?: boolean
  displayMaxAmount?: boolean
  onAmountChange?: (amount: BigNumber | undefined) => void
  error?: string
  onTokenChange?: (token: TokenModelBalanceWithIcon) => void
  isFetching?: boolean
}
