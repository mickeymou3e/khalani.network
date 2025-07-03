import { Effect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { contractsSelectors } from '@store/contracts/contracts.selectors'
import { IBalance } from '@store/pricedBalances/pricedBalances.types'

import { reduceTokensBalances } from './transform'

export function* fetchERC20BatchBalances(
  address: string,
  tokens: { address: string; decimals: number }[],
): Generator<Effect, IBalance> {
  const batchBalances = yield* select(contractsSelectors.addressBatchBalances)

  if (!batchBalances) throw Error('batch balances not found')

  const balances = yield* call(
    batchBalances.balancesOf,
    address,
    tokens.map(({ address }) => address),
  )

  return reduceTokensBalances(address, tokens, balances)
}
