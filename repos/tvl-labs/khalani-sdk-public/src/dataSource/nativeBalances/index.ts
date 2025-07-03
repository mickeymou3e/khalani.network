import { Effect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { INativeBalances } from '@store/nativeBalances/nativeBalances.types'
import { fetchTokenAmount } from './amount'
import { IChain } from '@store/chains/chains.types'

export function* fetchNativeTokensBalances(
  chains: IChain[],
  userAddress: string,
): Generator<Effect, INativeBalances[]> {
  const balances: INativeBalances[] = []
  for (let i = 0; i < chains.length; ++i) {
    const chain = chains[i]
    const balance = yield* call(fetchTokenAmount, userAddress, chain.rpcUrls)

    balances.push({
      id: chain.chainId,
      tokenSymbol: chain.nativeCurrency.symbol,
      balance,
      chainId: chain.chainId,
      decimals: chain.nativeCurrency.decimals,
    })
  }
  return balances
}
