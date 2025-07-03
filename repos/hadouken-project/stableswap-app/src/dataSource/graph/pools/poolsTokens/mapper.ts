import { LP_TOKEN_DECIMALS } from '@constants/Pool'
import { address } from '@dataSource/graph/utils/formatters'
import { IToken } from '@interfaces/token'

import { getTokens } from './constants'
import { ITokenQueryResult } from './types'

export function mapPoolTokensQueryResultData({
  poolTokens,
  poolLpTokens,
  lendingReserves,
  chainId,
}: ITokenQueryResult): IToken[] {
  const tokens = [
    ...poolTokens
      .filter(
        ({ address }) =>
          !poolLpTokens.map(({ address }) => address).includes(address),
      )
      .map((token) => {
        const reserveToken = lendingReserves.find(
          (reserve) => reserve.wrappedATokenAddress === token.address,
        )
        const isLendingToken = Boolean(reserveToken)
        return {
          ...token,
          id: address(token.address),
          address: address(token.address),
          name: token.name,
          symbol: token.symbol,
          decimals: Number(token.decimals),
          isLpToken: false,
          isLendingToken,
          unwrappedAddress: isLendingToken
            ? reserveToken?.aTokenAddress
            : undefined,
        }
      }),
    ...poolLpTokens.map((lpToken) => ({
      ...lpToken,
      id: address(lpToken.address),
      address: address(lpToken.address),
      name: lpToken.name,
      symbol: lpToken.symbol,
      decimals: LP_TOKEN_DECIMALS,
      isLpToken: true,
      displayName: lpToken.name,
    })),
  ]
  const lendingTokens = lendingReserves.reduce((newTokens, reserve) => {
    const token = tokens.find(
      (token) =>
        address(token.address) === address(reserve.wrappedATokenAddress),
    )
    if (token) {
      newTokens.push({
        ...token,
        id: address(reserve.underlyingAsset),
        address: address(reserve.aTokenAddress),
        unwrappedAddress: address(reserve.underlyingAsset),
        isLendingToken: true,
      })
    }
    return newTokens
  }, [] as IToken[])

  return [...tokens, ...lendingTokens].map((ele) => mapTokenNames(ele, chainId))
}

export const mapTokenNames = (token: IToken, chainId: string): IToken => {
  const mappedToken = getTokens(chainId).find(
    (foundToken) => address(foundToken.address) === address(token.address),
  )

  if (!mappedToken) {
    if (token.isLendingToken) {
      const mappedLendingToken = getTokens(chainId).find(
        (foundToken) =>
          address(foundToken.unwrappedAddress ?? '') === address(token.address),
      )

      return {
        ...token,
        id: address(token.address),
        address: address(token.address),
        displayName: mappedLendingToken?.displayName ?? token.symbol,
        symbol: mappedLendingToken?.symbol ?? token.symbol,
        name: mappedLendingToken?.name ?? token.name,
      }
    }

    return token
  }

  return {
    ...token,
    id: address(token.address),
    address: address(token.address),
    source: mappedToken.source,
    displayName: mappedToken.displayName,
    symbol: mappedToken.symbol,
    name: mappedToken.name,
  } as IToken
}
