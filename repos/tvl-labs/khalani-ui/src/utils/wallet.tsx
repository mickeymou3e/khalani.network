import React, { ReactElement } from 'react'

import { WrongLogo } from '@components/icons'
import { MetamaskIcon, WalletconnectIcon } from '@components/icons/wallets'
import { WalletType } from '@interfaces/wallet'

export const getWalletIcon = (type: WalletType): ReactElement => {
  switch (type) {
    case WalletType.METAMASK:
      return <MetamaskIcon />
    case WalletType.WALLETCONNECT:
      return <WalletconnectIcon />
    default:
      return <WrongLogo />
  }
}
