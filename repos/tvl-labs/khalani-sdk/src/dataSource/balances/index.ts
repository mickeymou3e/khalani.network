import { groupBy } from 'lodash'
import { Effect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { TokenModelBalanceWithChain } from '@store/tokens/tokens.types'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { Network } from '@constants/Networks'
import { formatTokenSymbol } from '@utils/token'
import { tokenAmountsMultiCall } from './multicall'
import { IBalances } from '@store/balances/balances.types'
import { chainsSelectors } from '@store/chains/chains.selector'
import { IMTokenBalances } from '@store/mTokenBalances'
import { Contract } from 'ethers-v6'

export function* fetchERC20Balances(
  tokens: TokenModelBalanceWithChain[],
  userAddress: string,
  tokenConnector: (tokenAddress: string) => Contract | null,
): Generator<Effect, IMTokenBalances[]> {
  const balances: IMTokenBalances[] = []
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i]
    const erc20Contract: Contract | null = yield* call(
      tokenConnector,
      token.address,
    )
    if (!erc20Contract) throw Error('Token contract not found')
    const balance = yield* call(erc20Contract.balanceOf, userAddress)

    balances.push({
      id: token.id,
      tokenSymbol: formatTokenSymbol(token.symbol) ?? '',
      balance,
      chainId: token.chainId,
      decimals: token.decimals,
      sourceChainId: token.sourceChainId,
    })
  }
  return balances
}

export function* fetchERC20MultiCallBalances(
  tokens: TokenModelBalanceWithChain[],
  userAddress: string,
): Generator<Effect, IBalances[]> {
  const selectChainById = yield* select(chainsSelectors.selectById)
  const selectTokenById = yield* select(tokenSelectors.selectById)

  const balances: IBalances[] = []
  const groupedTokens = groupBy(tokens, (n) => n.chainId)
  for (const key in groupedTokens) {
    const tokens = groupedTokens[key]
    const chain = selectChainById(key as Network)
    if (chain) {
      const context = yield* call(
        tokenAmountsMultiCall,
        tokens,
        userAddress,
        chain?.rpcUrls,
      )
      for (const contextKey in context.results) {
        const result = BigInt(
          context.results[contextKey].callsReturnContext[0].returnValues[0].hex,
        )
        const token = selectTokenById(contextKey)
        if (token) {
          balances.push({
            id: token.id,
            tokenSymbol: formatTokenSymbol(token.symbol) ?? '',
            balance: result,
            chainId: token.chainId,
            decimals: token.decimals,
          })
        }
      }
    }
  }

  return balances
}
