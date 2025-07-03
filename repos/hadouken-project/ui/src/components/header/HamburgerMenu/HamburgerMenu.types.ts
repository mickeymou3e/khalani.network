import { IHeaderProps } from '../Header'

export interface IHamburgerMenuProps {
  items?: IHeaderProps['items']
  chainId: IHeaderProps['chainId']
  authenticated?: IHeaderProps['authenticated']
  RouterLink: IHeaderProps['RouterLink']
  nativeTokenSymbol: IHeaderProps['nativeTokenSymbol']
  nativeTokenBalance: IHeaderProps['nativeTokenBalance']
  ethAddress: IHeaderProps['ethAddress']
  onAddressClick: IHeaderProps['onAddressClick']
  onChainClick: IHeaderProps['onChainClick']
  onWalletButtonClick: IHeaderProps['onWalletButtonClick']
  onLogoutClick: IHeaderProps['onLogoutClick']
}
