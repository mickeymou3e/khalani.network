import React from 'react'

import { ReactComponent as DaiIconComponent } from '@assets/currencies/DAI.svg'
import { ReactComponent as UsdcIconComponent } from '@assets/currencies/USDC.svg'
import { ReactComponent as UsdtIconComponent } from '@assets/currencies/USDT.svg'
import { IEntityWithIconComponent, TokenModel } from '@interfaces/tokens'

export const daiToken: TokenModel = {
  id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
  address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
  name: 'dai',
  decimals: 18,
  symbol: 'dai',
  displayName: 'dai',
}

export const daiTokenWithIcon: IEntityWithIconComponent = {
  id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
  name: 'dai',
  icon: (props) => <DaiIconComponent {...props} />,
}

export const usdcToken: TokenModel = {
  id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
  address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
  name: 'usdc',
  decimals: 6,
  symbol: 'usdc',
  displayName: 'usdc',
}

export const usdcTokenWithIcon: IEntityWithIconComponent = {
  id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
  name: 'usdc',
  icon: (props) => <UsdcIconComponent {...props} />,
}

export const usdtToken: TokenModel = {
  id: '0xE23FeAc3a2367b73bC1837E2368dcC4AF3B717c3',
  address: '0xE23FeAc3a2367b73bC1837E2368dcC4AF3B717c3',
  name: 'usdt',
  decimals: 6,
  symbol: 'usdt',
  displayName: 'usdt',
}

export const usdtTokenWithIcon: IEntityWithIconComponent = {
  id: '0xE23FeAc3a2367b73bC1837E2368dcC4AF3B717c3',
  name: 'usdt',
  icon: (props) => <UsdtIconComponent {...props} />,
}

export const tokens = [daiToken, usdcToken, usdtToken]
export const tokensWithIcons = [
  daiTokenWithIcon,
  usdcTokenWithIcon,
  usdtTokenWithIcon,
]
