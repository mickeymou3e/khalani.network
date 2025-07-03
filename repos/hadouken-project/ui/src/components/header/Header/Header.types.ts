import { LinkEnum } from '@components/Link'

export interface IPageLink {
  id: string
  linkType: LinkEnum
  href: string
  searchParams?: string
  text: string
}

export interface IHeaderLink {
  id: string
  text: string
  pages: IPageLink[]
}

export interface IHeaderProps {
  authenticated?: boolean
  ethAddress?: string
  chainId: number | null
  items?: IHeaderLink[]
  RouterLink: React.ElementType
  onHomeClick?: () => void
  onAddressClick?: (address: string) => void
  onWalletButtonClick?: () => void
  onChainClick?: () => void
  onLogoutClick?: () => void
  nativeTokenBalance?: string
  nativeTokenSymbol?: string
  isFetchingNativeTokenBalance?: boolean
  hideRightPanel?: boolean
  hideArrowChain?: boolean
}
