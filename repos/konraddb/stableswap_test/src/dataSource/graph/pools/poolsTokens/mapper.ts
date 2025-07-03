import { LP_TOKEN_DECIMALS } from '@constants/Pool'
import {
  BNB,
  CKB,
  DAI,
  ETH,
  USDC,
  USDT,
  WBTC,
} from '@dataSource/graph/pools/poolsTokens/constants'
import { address } from '@dataSource/graph/utils/formatters'
import { IToken } from '@interfaces/token'

import { IPoolToken, ITokenQueryResult } from './types'

export function mapPoolTokensQueryResultData({
  poolTokens,
  poolLpTokens,
}: ITokenQueryResult): IPoolToken[] {
  return [
    ...poolTokens
      .filter(
        ({ address }) =>
          !poolLpTokens.map(({ address }) => address).includes(address),
      )
      .map((token) => ({
        ...token,
        id: token.address,
        address: address(token.address),
        name: token.name,
        symbol: token.symbol,
        decimals: Number(token.decimals),
        isLpToken: false,
      })),
    ...poolLpTokens.map((lpToken) => ({
      ...lpToken,
      id: lpToken.address,
      address: address(lpToken.address),
      name: lpToken.name,
      symbol: lpToken.symbol,
      decimals: LP_TOKEN_DECIMALS,
      isLpToken: true,
    })),
  ].map(mapTokenNames)
}

export const mapTokenNames = (token: IToken): IToken => {
  switch (token.address) {
    case address(USDT.address):
      return {
        ...token,
        id: token?.address,
        name: USDT.name,
        symbol: USDT.symbol,
      } as IToken
    case address(USDC.address):
      return {
        ...token,
        id: token?.address,
        name: USDC.name,
        symbol: USDC.symbol,
      } as IToken
    case address(DAI.address):
      return {
        ...token,
        id: token?.address,
        name: DAI.name,
        symbol: DAI.symbol,
      } as IToken
    case address(ETH.address):
      return {
        ...token,
        id: token?.address,
        name: ETH.name,
        symbol: ETH.symbol,
      } as IToken
    case address(CKB.address):
      return {
        ...token,
        id: token?.address,
        name: CKB.name,
        symbol: CKB.symbol,
      } as IToken
    case address(WBTC.address):
      return {
        ...token,
        id: token?.address,
        name: WBTC.name,
        symbol: WBTC.symbol,
      } as IToken
    case address(BNB.address):
      return {
        ...token,
        id: token?.address,
        name: BNB.name,
        symbol: BNB.symbol,
      } as IToken

    default:
      return {
        ...token,
        id: token?.address,
        name: token.name,
        symbol: token.symbol,
      } as IToken
  }
}
