import React from 'react'

import { DaiIcon, UsdcIcon, UsdtIcon } from '@hadouken-project/ui'
import { IToken, IEntityWithIconComponent } from '@interfaces/token'

export const TEST_BOOSTED_POOL_TOKEN: IToken = {
  id: '0x58c7d8f659cd78da06fd4f7a991000fa472417b1',
  address: '0x58c7d8f659cd78da06fd4f7a991000fa472417b1',
  name: '2pool',
  symbol: 'HDK-B-2Pool',
  decimals: 18,

  isLpToken: false,
  displayName: '2pool',
}

export const TEST_BOOSTED_USDT_BINANCE_TOKEN: IToken = {
  id: '0x086dd8f69793100e745a9549bce68459e2c46f82',
  address: '0x086dd8f69793100e745a9549bce68459e2c46f82',
  name: 'Hadouken Boosted USD / USDT|BSC Stable Pool',
  symbol: 'HDK-Boosted-USD-USDT-BSC',
  decimals: 18,

  isLpToken: true,
  displayName: 'Hadouken Boosted USD / USDT|BSC Stable Pool',
}

export const TEST_ETH_TOKEN: IToken = {
  id: '0xff900e1436cbcd25d72b7dafe6ef4d569405cc05',
  address: '0xff900e1436cbcd25d72b7dafe6ef4d569405cc05',
  name: 'Force Bridge ETH from Ethereum',
  symbol: 'ETH',
  decimals: 18,
  isLpToken: false,
  displayName: 'ETH',
  source: 'eth',
}

export const TEST_USDC_TOKEN: IToken = {
  id: '0x0c7f21908222098616803eff5d054d3f4ef57ebb',
  address: '0x0c7f21908222098616803eff5d054d3f4ef57ebb',
  name: 'Force Bridge USDC from Ethereum',
  symbol: 'USDC',
  decimals: 6,

  isLpToken: false,
  displayName: 'USDC',
  source: 'eth',
}

export const TEST_USDC_BSC_TOKEN: IToken = {
  id: '0xa99dfda7c245d17a6f6d6febf02443440d0022cd',
  address: '0xa99dfda7c245d17a6f6d6febf02443440d0022cd',
  name: 'USDC BSC Metapool',
  symbol: 'HDK-USDC',
  decimals: 18,
  isLpToken: true,
  displayName: 'USDC BSC Metapool',
}

export const TEST_WBTC_TOKEN: IToken = {
  id: '0x6a447ba163039d7e1d674668578a0eb049245915',
  address: '0x6a447ba163039d7e1d674668578a0eb049245915',
  name: 'Force Bridge WBTC from Ethereum',
  symbol: 'WBTC',
  decimals: 8,
  isLpToken: false,
  displayName: 'WBTC',
  source: 'eth',
}

export const TEST_CKB_TOKEN: IToken = {
  id: '0x0eb76790a2014dd1f65488ccd703bcdf75f8195e',
  address: '0x0eb76790a2014dd1f65488ccd703bcdf75f8195e',
  name: 'pCKB',
  symbol: 'CKB',
  decimals: 18,
  isLpToken: false,
  displayName: 'CKB',
  source: 'gw',
}

export const TEST_DCKB_TOKEN: IToken = {
  id: '0xa0f31014fca74e2b64c8e3b720272f2a3d516f36',
  address: '0xa0f31014fca74e2b64c8e3b720272f2a3d516f36',
  name: 'dCKB',
  symbol: 'dCKB',
  decimals: 8,

  isLpToken: false,
  displayName: 'dCKB',
}

export const TEST_BNB_BINANCE_TOKEN: IToken = {
  id: '0x3b5b0179fdef8f88c39a94039b66120933729ace',
  address: '0x3b5b0179fdef8f88c39a94039b66120933729ace',
  name: 'Force Bridge BNB from BSC',
  symbol: 'BNB',
  decimals: 18,
  isLpToken: false,
  displayName: 'BNB',
  source: 'bsc',
}

export const TEST_BUSD_TOKEN: IToken = {
  id: '0x4b324bfa9f8a52dc1ae321ae1b744f036b8d05cd',
  address: '0x4b324bfa9f8a52dc1ae321ae1b744f036b8d05cd',
  name: 'BUSD',
  symbol: 'HDK-BUSD',
  decimals: 18,
  isLpToken: true,
  displayName: 'BUSD',
}

export const TEST_BUSD_BINANCE_TOKEN: IToken = {
  id: '0x437f3a7e7af6c611cdbbd33ce79c56aa7b6f7001',
  address: '0x437f3a7e7af6c611cdbbd33ce79c56aa7b6f7001',
  name: 'Force Bridge BUSD from BSC',
  symbol: 'BUSD|bsc',
  decimals: 18,
  isLpToken: false,
  displayName: 'BUSD|bsc',
  source: 'bsc',
}

export const TEST_USDT_TOKEN: IToken = {
  id: '0x30b0a247de59a1cdf44329b756d3343e5afed7f9',
  address: '0x30b0a247de59a1cdf44329b756d3343e5afed7f9',
  name: 'Force Bridge USDT from Ethereum',
  symbol: 'USDT',
  decimals: 6,

  isLpToken: false,
  displayName: 'USDT',
  source: 'eth',
}

export const TEST_H_USDT_TOKEN: IToken = {
  id: '0x4fa5ad2756ac3c62285ec896acc2d514c65f3ed3',
  address: '0x4fa5ad2756ac3c62285ec896acc2d514c65f3ed3',
  name: 'hUSDT',
  symbol: 'hUSDT',
  decimals: 6,

  isLpToken: false,
  displayName: 'hUSDT',
  source: 'gw',
}

export const TEST_H_ETH_TOKEN: IToken = {
  id: '0x6b6bceb1f7e1f6efb203d7f75beb34beac62fe43',
  address: '0x6b6bceb1f7e1f6efb203d7f75beb34beac62fe43',
  name: 'hETH',
  symbol: 'hETH',
  decimals: 18,
  isLpToken: false,
  displayName: 'hETH',
  source: 'gw',
}

export const TEST_H_CKB_TOKEN: IToken = {
  id: '0xe7ea406348db83f3a0014295d859fb3c896a226b',
  address: '0xe7ea406348db83f3a0014295d859fb3c896a226b',
  name: 'hCKB',
  symbol: 'hCKB',
  decimals: 18,
  isLpToken: false,
  displayName: 'hCKB',
  source: 'gw',
}

export const TEST_USDT_BINANCE_TOKEN: IToken = {
  id: '0xb5e2f2cf4611bcc578977aca17a9724b4b1e9863',
  address: '0xb5e2f2cf4611bcc578977aca17a9724b4b1e9863',
  name: 'Force Bridge USDT from BSC',
  symbol: 'USDT|bsc',
  decimals: 18,

  isLpToken: false,
  displayName: 'USDT',

  source: 'bsc',
}

export const TEST_H_USDC_TOKEN: IToken = {
  id: '0x70a58262bc55fbf3965bd1c0861e3ddf1a253777',
  address: '0x70a58262bc55fbf3965bd1c0861e3ddf1a253777',
  name: 'hUSDC',
  symbol: 'hUSDC',
  decimals: 6,

  isLpToken: false,
  displayName: 'hUSDC',
  source: 'gw',
}

export const TEST_H_WBTC_TOKEN: IToken = {
  id: '0xf504082c78c0bdf6f301d773ae6553f6264249e0',
  address: '0xf504082c78c0bdf6f301d773ae6553f6264249e0',
  name: 'hWBTC',
  symbol: 'hWBTC',
  decimals: 8,
  isLpToken: false,
  displayName: 'hWBTC',
  source: 'gw',
}

export const TEST_LNR_USDC_TOKEN: IToken = {
  id: '0x003ab2a164fcd7b5384c8bf4939806f11a1dc32d',
  address: '0x003ab2a164fcd7b5384c8bf4939806f11a1dc32d',
  name: 'Linear USDC',
  symbol: 'HDK-LNR-USDC',
  decimals: 18,

  isLpToken: true,
  displayName: 'Linear USDC',
}

export const TEST_LNR_USDT_TOKEN: IToken = {
  id: '0x0c31aa0331d64e93a9a9a5a6382d477e81d0992f',
  address: '0x0c31aa0331d64e93a9a9a5a6382d477e81d0992f',
  name: 'Linear USDT',
  symbol: 'HDK-LNR-USDT',
  decimals: 18,

  isLpToken: true,
  displayName: 'Linear USDT',
}

export const TEST_LNR_WBTC_TOKEN: IToken = {
  id: '0x3458cd69a35232b6d4bbfc16376c4ffb1ef9d302',
  address: '0x3458cd69a35232b6d4bbfc16376c4ffb1ef9d302',
  name: 'Linear WBTC',
  symbol: 'HDK-LNR-WBTC',
  decimals: 18,
  isLpToken: true,
  displayName: 'Linear WBTC',
}

export const TEST_LNR_ETH_TOKEN: IToken = {
  id: '0xaf4ea576c3f63446d0dc9ee4988cd08b51a7d597',
  address: '0xaf4ea576c3f63446d0dc9ee4988cd08b51a7d597',
  name: 'Linear ETH',
  symbol: 'HDK-LNR-ETH',
  decimals: 18,
  isLpToken: false,
  displayName: 'Linear ETH',
}

export const TEST_LNR_CKB_TOKEN: IToken = {
  id: '0xb8e6cfbdffecf3ef086aad22cad9f653bbd80fd5',
  address: '0xb8e6cfbdffecf3ef086aad22cad9f653bbd80fd5',
  name: 'Linear CKB',
  symbol: 'HDK-LNR-CKB',
  decimals: 18,
  isLpToken: false,
  displayName: 'Linear CKB',
}

export const TEST_CELER_USDC_TOKEN: IToken = {
  id: '0x4ea08dca142f103ac2d5ff95f1d376712c5ef5a9',
  address: '0x4ea08dca142f103ac2d5ff95f1d376712c5ef5a9',
  name: 'Celer USDC',
  symbol: 'USDC',
  decimals: 6,
  isLpToken: false,
  displayName: 'ceUSDC',
  source: 'ce',
}

export const TEST_CELER_USDT_TOKEN: IToken = {
  id: '0xcdb3d2dc427a5bc9af54a9c2ed2f5950619184bf',
  address: '0xcdb3d2dc427a5bc9af54a9c2ed2f5950619184bf',
  name: 'Celer USDT',
  symbol: 'USDT',
  decimals: 6,
  isLpToken: false,
  displayName: 'ceUSDT',
  source: 'ce',
}

export const TEST_CELER_BOOSTED_POOL_TOKEN: IToken = {
  id: '0xa996ed2c88ed9b207d39ab2ade42e963fe58bae2',
  address: '0xa996ed2c88ed9b207d39ab2ade42e963fe58bae2',
  name: 'Celer USD Stable Pool',
  symbol: 'HDK-Boosted-USD-ceUSDC-ceUSDT',
  decimals: 18,
  isLpToken: true,
  displayName: 'Celer USD Stable Pool',
}

export const lpToken: IToken = {
  id: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f512',
  address: '0x85a454E7388AEC5783FD237eCA1a6a96Ed56f512',
  name: 'hdk',
  decimals: 18,
  symbol: 'hdk',
  displayName: 'hdk',
}

export const daiToken: IToken = {
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
  icon: (props) => <DaiIcon {...props} />,
}

export const usdcToken: IToken = {
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
  icon: (props) => <UsdcIcon {...props} />,
}

export const usdtToken: IToken = {
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
  icon: (props) => <UsdtIcon {...props} />,
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
]
