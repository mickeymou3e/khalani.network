import { Network } from '@constants/Networks'
import { CallEffect, SelectEffect } from 'redux-saga/effects'
import { call, select } from 'typed-redux-saga'

import { chainsSelectors } from '../chains.selector'
import { IChain } from '../chains.types'
import { findChain } from './findChain'

export function* getChainConfig(
  expectedNetwork: Network | null,
): Generator<CallEffect<IChain | undefined> | SelectEffect> {
  const chains = yield* select(chainsSelectors.chains)
  const findedChain = yield* call(findChain, chains, expectedNetwork)

  return findedChain
}
