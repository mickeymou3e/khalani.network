import { put, select } from 'typed-redux-saga'

import { pricesSelector } from '@store/prices/prices.selector'
import { BigDecimal } from '@utils/math'

import { lockdropSelectors } from '../../lockDrop.selector'
import { lockDropActions } from '../../lockDrop.slice'

export function* phaseOneCalculateEstimatedReward(): Generator {
  const amount = yield* select(lockdropSelectors.phaseOneLockAmount)
  const boost = yield* select(lockdropSelectors.phaseOneLockBoost)
  const totalValueLockedWithWeights = yield* select(
    lockdropSelectors.lockdropTotalWithWeights,
  )
  const selectedToken = yield* select(
    lockdropSelectors.phaseOneSelectedLockToken,
  )

  const totalHdkReward = yield* select(lockdropSelectors.totalRewardHDK)

  const selectTokenPrice = yield* select(pricesSelector.selectById)

  if (
    amount.gt(BigDecimal.from(0)) &&
    boost.dayBoost &&
    boost.lockLengthBoost &&
    selectedToken &&
    totalValueLockedWithWeights
  ) {
    const tokenPrice = selectTokenPrice(selectedToken.address)

    // Make it to string because boost can be float value
    const dayBoostBigDecimal = BigDecimal.fromString(boost.dayBoost.toString())
    const lockLengthBoostBigDecimal = BigDecimal.fromString(
      boost.lockLengthBoost.toString(),
    )

    const price = tokenPrice?.price ?? BigDecimal.from(0)

    const userLockWeight = amount
      .mul(dayBoostBigDecimal)
      .mul(lockLengthBoostBigDecimal)
      .mul(price)

    const userShareInTotalReward = totalHdkReward.mul(userLockWeight)

    const userWeightWithTotal = userLockWeight.add(totalValueLockedWithWeights)

    const reward = userShareInTotalReward.div(userWeightWithTotal, 18)

    yield* put(lockDropActions.phaseOneCalculateEstimatedRewardSuccess(reward))
  } else {
    yield* put(
      lockDropActions.phaseOneCalculateEstimatedRewardSuccess(
        BigDecimal.from(0),
      ),
    )
  }
}
