import { IUSDAmount, ITokenSelectorBalance } from '@tvl-labs/khalani-ui'
import { IPrice, TokenModelBalanceWithChain, BigDecimal } from '@tvl-labs/sdk'

export const getTokenUSDAmount = (
  tokenValue: bigint | undefined,
  tokenDecimals: number | undefined,
  usdPrice: IPrice | undefined,
): IUSDAmount | undefined => {
  if (!tokenDecimals || !tokenValue || !usdPrice) return

  const amount = tokenValue * usdPrice.price.toBigInt()

  return {
    value: amount,
    decimals: usdPrice.price.decimals + tokenDecimals,
  }
}

export const sortDescendingBigNumberValues = (
  tokens: TokenModelBalanceWithChain[],
  balances: ITokenSelectorBalance[],
): TokenModelBalanceWithChain[] =>
  tokens.sort((a, b) => {
    const foundABalance = balances.find((balance) => balance.tokenId === a.id)
    const foundBBalance = balances.find((balance) => balance.tokenId === b.id)

    const aBalance = BigDecimal.from(
      foundABalance?.balance ?? BigInt(0),
      a.decimals,
    )
    const bBalance = BigDecimal.from(
      foundBBalance?.balance ?? BigInt(0),
      b.decimals,
    )

    return aBalance.lt(bBalance) ? 1 : aBalance.gt(bBalance) ? -1 : 0
  })
