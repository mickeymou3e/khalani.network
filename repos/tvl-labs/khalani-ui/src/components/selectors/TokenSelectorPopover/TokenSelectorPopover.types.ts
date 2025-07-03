import { TokenModel } from '@interfaces/core'

export interface TokenSelectorPopoverProps {
  tokens: TokenModel[]
  open: boolean
  anchorEl: HTMLButtonElement | null
  selectedTokenId: string | undefined
  handleTokenSelect: (chain: TokenModel) => void
  handleClose: () => void
}

export interface ITokenSelectorBalance {
  tokenId: string
  balance: bigint
}
