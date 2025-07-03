import { Effect } from 'redux-saga/effects'
import { all, call, select } from 'typed-redux-saga'

import { address } from '@dataSource/graph/utils/formatters'
import { IDepositToken } from '@store/deposit/deposit.types'
import {
  LockdropDepositedTokensBalances,
  LockdropPhaseTwo,
} from '@store/lockDrop/lockDrop.types'
import { networkSelectors } from '@store/network/network.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { BigDecimal } from '@utils/math'
import { config } from '@utils/network'

import { getDepositedTokensBalances } from '../fetchDepositedTokensBalances.saga'
import { getDistributedHDKTokensOnChain } from '../fetchDistributedHDKTokensOnChain.saga'
import { getParticipation } from '../fetchParticipation.saga'

export function* initializeLockdropPhaseTwo(): Generator<
  Effect,
  { phaseTwo: LockdropPhaseTwo }
> {
  const chainId = yield* select(networkSelectors.applicationChainId)

  const lockdropConfigTokens = config.lockDropTokens[chainId]

  const selectToken = yield* select(tokenSelectors.selectById)

  const priceToken = selectToken(address(lockdropConfigTokens.PriceToken))
  const hadoukenToken = selectToken(address(lockdropConfigTokens.Hdk))

  const [
    totalHdkTokensDistributedOnChain,
    participation,
    lockdropDepositBalances,
  ] = (yield* all([
    call(getDistributedHDKTokensOnChain),
    call(getParticipation),
    call(getDepositedTokensBalances),
  ])) as [BigDecimal, BigDecimal, LockdropDepositedTokensBalances]

  if (!priceToken || !hadoukenToken)
    throw new Error('Deposit lockdrop tokens not defined')

  const depositTokens = [priceToken, hadoukenToken].map((token) => {
    const depositToken: IDepositToken = {
      ...token,
      amount: undefined,
      displayName: token.displayName ?? token.symbol,
    }

    return depositToken
  })

  const depositTokensAmount = depositTokens.reduce<
    Record<string, BigDecimal | undefined>
  >((depositAmount, token) => {
    depositAmount[token.address] = undefined

    return depositAmount
  }, {})

  return {
    phaseTwo: {
      deposit: {
        tokens: depositTokens,
        tokensAmount: depositTokensAmount,
        isInProgress: false,
      },
      totalHDKTokensOnChain: totalHdkTokensDistributedOnChain,
      participationOnChain: participation,
      lockdropDepositBalances,
    },
  }
}
