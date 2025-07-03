import { TokenModelBalanceWithChain } from '@tvl-labs/sdk'

//TO-DO: Remove when we will deploy CALP pool with BUSD

const BUSD_SYMBOL = 'BUSD'

export const includesBusd = (token: TokenModelBalanceWithChain | undefined) =>
  token?.symbol.includes(BUSD_SYMBOL)

export const filterBusdTokens = (
  tokens: TokenModelBalanceWithChain[],
  selectedToken: TokenModelBalanceWithChain | undefined,
) =>
  tokens.filter((token) =>
    includesBusd(selectedToken) ? includesBusd(token) : !includesBusd(token),
  )

export const findBusdToken = (
  tokens: TokenModelBalanceWithChain[] | undefined,
) => tokens?.find((token) => token.symbol.includes(BUSD_SYMBOL))
