import { Effect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { chainsSelectors } from '@store/chains/chains.selector'
import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { IKhalaBalances } from '@store/khala/balances/balances.types'
import { ITokenModelBalanceWithChain } from '@store/khala/tokens/tokens.types'
import { getTokenAmount } from '@utils/tokenAmount'

export function* fetchERC20MultiChainBalances(
  tokens: ITokenModelBalanceWithChain[],
  userAddress: string,
): Generator<Effect, IKhalaBalances[]> {
  const chainSelector = yield* select(chainsSelectors.selectById)

  const balances: IKhalaBalances[] = []
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i]
    const chain = chainSelector(token.chainId)

    if (chain) {
      const balance = yield* call(
        getTokenAmount,
        chain?.rpcUrls[0],
        token.address,
        userAddress,
      )
      balances.push({ id: token.id, balance, chainId: token.chainId })
    }
  }
  return balances
}

export function* fetchERC20CurrentChainBalances(
  tokens: ITokenModelBalanceWithChain[],
  userAddress: string,
): Generator<Effect, IKhalaBalances[]> {
  const tokenConnector = yield* select(
    contractsSelectors.crossChainTokenConnector,
  )
  const balances: IKhalaBalances[] = []
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i]
    const erc20Contract = tokenConnector
      ? yield* call(tokenConnector, token.address)
      : null
    if (!erc20Contract) throw Error('Token contract not found')
    const balance = yield* call(erc20Contract.balanceOf, userAddress)

    balances.push({ id: token.id, balance, chainId: token.chainId })
  }
  return balances
}
