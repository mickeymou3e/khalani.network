import { IHeaderProps } from '../Header'
import { IPageLink } from '../Header/Header.types'

export interface IMobileMenuProps {
  items?: IHeaderProps['items']
  open: boolean
  authenticated?: boolean
  ethAddress?: string
  chainId: IHeaderProps['chainId']
  onWalletButtonClick?: IHeaderProps['onWalletButtonClick']
  nativeTokenSymbol: IHeaderProps['nativeTokenSymbol']
  nativeTokenBalance: IHeaderProps['nativeTokenBalance']
  RouterLink: React.ElementType
  handleClose?: () => void
  onTabClick?: (item: IPageLink) => void
  onAddressClick?: (address: string) => void
}
