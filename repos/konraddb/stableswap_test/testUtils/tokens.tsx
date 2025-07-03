import React from 'react'

import { IEntityWithIconComponent } from '@components/TokenPaperList/TokenPaperList.types'
import { ALL_TOKENS_ID } from '@constants/Tokens'
import { DaiIcon, UsdcIcon, UsdtIcon } from '@hadouken-project/ui'
import { IToken } from '@interfaces/token'

export const lpToken: IToken = {
  id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f512',
  address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f512',
  name: 'hdk',
  decimals: 18,
  symbol: 'hdk',
}

export const daiToken: IToken = {
  id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
  address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
  name: 'dai',
  decimals: 18,
  symbol: 'dai',
}

export const daiTokenWithIcon: IEntityWithIconComponent = {
  id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f511',
  name: 'dai',
  icon: (props) => <DaiIcon {...props} />,
}

export const usdcToken: IToken = {
  id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
  address: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
  name: 'usdc',
  decimals: 6,
  symbol: 'usdc',
}

export const usdcTokenWithIcon: IEntityWithIconComponent = {
  id: '0xA600286A67c5BaedCDb4bEA2696Ff51fE72cF419',
  name: 'usdc',
  icon: (props) => <UsdcIcon {...props} />,
}

export const usdtToken: IToken = {
  id: '0xE23FeAc3a2367b73bC1837E2368dcC4AF3B717c3',
  address: '0xE23FeAc3a2367b73bC1837E2368dcC4AF3B717c3',
  name: 'usdt',
  decimals: 6,
  symbol: 'usdt',
}

export const usdtTokenWithIcon: IEntityWithIconComponent = {
  id: '0xE23FeAc3a2367b73bC1837E2368dcC4AF3B717c3',
  name: 'usdt',
  icon: (props) => <UsdtIcon {...props} />,
}

export const allWithIcons: IEntityWithIconComponent = {
  id: ALL_TOKENS_ID,
  name: ALL_TOKENS_ID,
  icon: (props) => <DaiIcon {...props} />,
}

export const tokensReducerMock = {
  ids: [daiToken.address, usdcToken.address, usdtToken.address],
  entities: {
    [daiToken.address]: daiToken,
    [usdcToken.address]: usdcToken,
    [usdtToken.address]: usdtToken,
  },
}

export const tokens = [daiToken, usdcToken, usdtToken]
export const tokensWithIcons = [
  daiTokenWithIcon,
  usdcTokenWithIcon,
  usdtTokenWithIcon,
  allWithIcons,
]
