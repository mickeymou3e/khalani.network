import { IHeaderProps } from '../Header'
import { IPageLink } from '../Header/Header.types'

export interface IMobileMenuProps {
  items?: IHeaderProps['items']
  open: boolean
  showConnectWalletButton: boolean
  authenticated?: boolean
  ethAddress?: string
  onWalletButtonClick?: IHeaderProps['onWalletButtonClick']
  RouterLink: React.ElementType
  handleClose?: () => void
  onTabClick?: (item: IPageLink) => void
  onAddressClick?: (address: string) => void
}
