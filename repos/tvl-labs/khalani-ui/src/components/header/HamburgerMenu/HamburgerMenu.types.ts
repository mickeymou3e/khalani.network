import { IHeaderProps } from '../Header'

export interface IHamburgerMenuProps {
  items?: IHeaderProps['items']
  authenticated?: IHeaderProps['authenticated']
  RouterLink: IHeaderProps['RouterLink']
  ethAddress: IHeaderProps['ethAddress']
  onAddressClick: IHeaderProps['onAddressClick']
  onWalletButtonClick?: () => void
  showConnectWalletButton: boolean
}
