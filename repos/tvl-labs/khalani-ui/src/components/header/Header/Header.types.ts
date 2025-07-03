import { LinkEnum } from '@components/Link'
import { INetworkDetailsProps } from '@components/account/NetworkDetails'

export interface IPageLink {
  id: string
  linkType: LinkEnum
  href: string
  internalHrefs?: string[]
  searchParams?: string
  text: string
}

export interface IHeaderLink {
  id: string
  text: string
  pages: IPageLink[]
}

export interface IHeaderProps extends INetworkDetailsProps {
  currentTabId: string | undefined
  authenticated?: boolean
  ethAddress?: string
  items?: IHeaderLink[]
  RouterLink: React.ElementType
  showConnectWalletButton: boolean
  isUnsupportedNetwork?: boolean
  headerLogo?: React.ReactNode
  onHomeClick?: () => void
  onAddressClick?: (address: string) => void
  onWalletButtonClick?: () => void
}
