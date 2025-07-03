import { StrictEffect } from 'redux-saga/effects'
import { select } from 'typed-redux-saga'

import { PoolType } from '@interfaces/pool'

import { poolSelectors } from './pool/selectors/pool.selector'

export function* isBoostedToken(
  tokenAddress: string,
): Generator<StrictEffect, boolean> {
  const selectPoolById = yield* select(poolSelectors.selectByAddress)
  const pool = selectPoolById(tokenAddress)
  if (!pool) return false

  for (const token of pool.tokens) {
    if (!token.isLpToken) {
      const isLinear = yield* isLinearToken(token.address)
      if (!isLinear) return isLinear
    }
  }

  return true
}

export function* isLinearToken(
  tokenAddress: string,
): Generator<StrictEffect, boolean> {
  const selectPoolById = yield* select(poolSelectors.selectByAddress)
  const pool = selectPoolById(tokenAddress)
  if (!pool) return false

  return pool.poolType === PoolType.AaveLinear
}
