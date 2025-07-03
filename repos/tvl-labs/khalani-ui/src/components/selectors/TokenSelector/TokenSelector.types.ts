import { TokenModel } from '@interfaces/core'

export interface TokenSelectorProps {
  tokens: TokenModel[]
  selectedToken: TokenModel | undefined
  handleTokenChange: (chain: TokenModel) => void
}
