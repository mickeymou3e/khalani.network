import { BigNumber } from 'ethers'

import { getPoolConfig } from '@dataSource/graph/pools/pools/constants'
import { address } from '@dataSource/graph/utils/formatters'
import { TokenModelBalanceWithIcon } from '@hadouken-project/ui'
import { createSelector } from '@reduxjs/toolkit'
import { networkSelectors } from '@store/network/network.selector'
import { poolsModelsSelector } from '@store/pool/selectors/models/pool-model.selector'
import { StoreKeys } from '@store/store.keys'
import { selectReducer } from '@store/store.utils'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { BigDecimal } from '@utils/math'
import { config } from '@utils/network'

import { lockdropAdapter } from './lockDrop.slice'

const phaseOneLockAmount = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseOne?.lock.amount ?? BigDecimal.from(0),
)

const phaseOneLockLength = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseOne?.lock.lockLength ?? 120,
)

const phaseOneIsLockInProgress = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseOne?.lock.isInProgress,
)

const phaseOneLockBoost = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => {
    return {
      lockLengthBoost: state?.phaseOne?.lock.lockLengthBoost,
      dayBoost: state?.phaseOne?.lock.dayBoost,
    }
  },
)

const phaseOneEstimatedReward = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.phaseOne?.lock.estimatedReward,
)

const phaseOneLockDropTokens = createSelector(
  [
    tokenSelectors.selectMany,
    userSharesSelectors.selectUserPoolShare,
    networkSelectors.applicationChainId,
    poolsModelsSelector.selectByAddress,
  ],
  (
    selectTokens,
    selectUserLpTokenBalance,
    applicationChainId,
    selectPoolModel,
  ) => {
    const lockdorpTokens = config.lockDropTokens[applicationChainId]

    const lockDropTokensAddresses = [
      lockdorpTokens.BoostedUSD,
      lockdorpTokens.TriCrypto,
    ]

    const tokens = selectTokens(lockDropTokensAddresses)

    return tokens.map((token) => {
      // User can lock only Boosted USD and 3crypto
      const pool = getPoolConfig(token.address, applicationChainId)
      const poolModel = selectPoolModel(token.address)

      const balance = poolModel
        ? selectUserLpTokenBalance(poolModel.id)
        : BigDecimal.from(0)

      return {
        ...token,
        balance: balance?.toBigNumber() ?? BigNumber.from(0),
        displayName: pool?.displayName ?? token.displayName,
        name: pool?.displayName ?? token.name,
      } as TokenModelBalanceWithIcon
    })
  },
)

const phaseOneSelectedLockToken = createSelector(
  [selectReducer(StoreKeys.LockDrop), phaseOneLockDropTokens],
  (lockDropState, lockDropTokens) => {
    const token = lockDropTokens.find(
      (token) =>
        address(token.address) ===
        address(lockDropState?.phaseOne?.lock.tokenAddress ?? ''),
    )

    return token
  },
)

const phaseOneIsCalculatingReward = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseOne?.lock.isCalculatingReward,
)

const phaseOneStartTime = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.phaseOneStartTime,
)

const totalUserHdkToClaim = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.totalUserHdkToClaim,
)

const phaseTwoDepositTokens = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseTwo?.deposit.tokens ?? [],
)

const phaseTwoDepositTokensAmounts = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseTwo?.deposit.tokensAmount,
)
const phaseTwoUserAlreadyCollectedHDKTokens = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => {
    const userLockdrops = lockdropAdapter
      .getSelectors()
      .selectAll(state.lockDrops)

    const areAllLocksClaimed = userLockdrops.every(
      (lock) => lock.isClaimed === true,
    )

    return areAllLocksClaimed
  },
)

const phaseTwoDepositIsInProgress = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseTwo?.deposit.isInProgress,
)

const phaseTwoDepositAmountsEqualToZero = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => {
    return Object.values(state?.phaseTwo?.deposit.tokensAmount ?? {}).every(
      (tokenAmount) => !tokenAmount || !tokenAmount.gt(BigDecimal.from(0)),
    )
  },
)

const phaseTwoTotalHDKTokensOnChain = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.phaseTwo?.totalHDKTokensOnChain ?? BigDecimal.from(0),
)

const phaseTwoParticipationOnChain = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.phaseTwo?.participationOnChain ?? BigDecimal.from(0),
)

const phaseTwoUserPriceTokenDepositBalance = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) =>
    state.phaseTwo?.lockdropDepositBalances?.userPriceTokenDepositAmount ??
    BigDecimal.from(0),
)
const phaseTwoUserHdkDepositBalance = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) =>
    state.phaseTwo?.lockdropDepositBalances?.userHdkDepositAmount ??
    BigDecimal.from(0),
)

const phaseTwoTotalPriceTokenDepositBalance = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) =>
    state.phaseTwo?.lockdropDepositBalances?.totalPriceTokenDepositAmount ??
    BigDecimal.from(0),
)

const phaseTwoTotalHdkDepositBalance = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) =>
    state.phaseTwo?.lockdropDepositBalances?.totalHdkDepositAmount ??
    BigDecimal.from(0),
)

const phaseTwoUserSharePriceTokenInPercentage = createSelector(
  [phaseTwoUserPriceTokenDepositBalance, phaseTwoTotalPriceTokenDepositBalance],
  (userPriceTokenDepositBalance, totalPriceTokenDepositBalance) => {
    const userSharePriceTokenInPercentage = userPriceTokenDepositBalance
      .div(totalPriceTokenDepositBalance, 18)
      .mul(BigDecimal.from(100, 0))
      .toNumber()

    return userSharePriceTokenInPercentage
  },
)

const phaseTwoUserShareHdkInPercentage = createSelector(
  [phaseTwoUserHdkDepositBalance, phaseTwoTotalHdkDepositBalance],
  (userHdkDepositBalance, totalHdkDepositBalance) => {
    const userShareHdkInPercentage = userHdkDepositBalance
      .div(totalHdkDepositBalance, 18)
      .mul(BigDecimal.from(100, 0))
      .toNumber()

    return userShareHdkInPercentage
  },
)

const phaseTwoDepositBalances = createSelector(
  [
    phaseTwoUserPriceTokenDepositBalance,
    phaseTwoUserHdkDepositBalance,
    phaseTwoTotalPriceTokenDepositBalance,
    phaseTwoTotalHdkDepositBalance,
    phaseTwoUserSharePriceTokenInPercentage,
    phaseTwoUserShareHdkInPercentage,
  ],
  (
    userPriceTokenDepositBalance,
    userHdkDepositBalance,
    totalPriceTokenDepositBalance,
    totalHdkDepositBalance,
    userSharePriceTokenInPercentage,
    userShareHdkInPercentage,
  ) => ({
    userPriceTokenDepositBalance,
    userHdkDepositBalance,
    totalPriceTokenDepositBalance,
    totalHdkDepositBalance,
    userSharePriceTokenInPercentage,
    userShareHdkInPercentage,
  }),
)

const phaseThreeCurrentIdForUnlock = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseThree?.unlock.currentIdForUnlock,
)

const phaseThreeTotalUserLpTokensAvailableToClaim = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) =>
    state?.phaseThree?.claimLps.totalUserLpTokensAvailableToClaim ??
    BigDecimal.from(0),
)

const phaseThreeUserLpTokensClaimed = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseThree?.claimLps.userLpClaimed ?? BigDecimal.from(0),
)

const phaseThreeCurrentAvailableLpTokens = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) =>
    state?.phaseThree?.claimLps.currentAvailableLpTokens ?? BigDecimal.from(0),
)

const phaseThreeDaysLeft = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseThree?.claimLps.daysLeft,
)

const phaseThreeIsClaimInProgress = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.phaseThree?.claimLps.isInProgress,
)

const userLocksTransactions = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => lockdropAdapter.getSelectors().selectAll(state.lockDrops),
)

const lockDropTimeLeft = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.timer,
)

const isClaimHDKInProgress = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state?.isClaimHDKInProgress,
)

const isClaimSuccessful = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => Boolean(state.claimSuccessful),
)

const isLockDropTimeFinished = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => {
    if (state.timer) {
      const { days, hours, minutes, seconds } = state.timer

      return days === 0 && hours === 0 && minutes === 0 && seconds === 0
    }

    return false
  },
)

const lockdropPhaseEndTime = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.phaseEndTime,
)

const lockdropCurrentPhase = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.currentPhase,
)

const lockdropTotalValueLockedUSD = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.lockdropTvl.totalValueLocked,
)

const lockdropTotalWithWeights = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.lockdropTvl.totalValueLockedWithWeights,
)

const totalUserCapitalLockInUSD = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.totalUserValueLocked,
)

const totalRewardHDK = createSelector(
  selectReducer(StoreKeys.LockDrop),
  (state) => state.totalHdkTokens,
)

export const lockdropSelectors = {
  phaseOneLockDropTokens,
  phaseOneLockAmount,
  phaseOneSelectedLockToken,
  phaseOneLockBoost,
  phaseOneLockLength,
  phaseOneIsLockInProgress,
  phaseOneEstimatedReward,
  phaseOneIsCalculatingReward,
  phaseOneStartTime,

  phaseTwoDepositTokens,
  phaseTwoDepositTokensAmounts,
  phaseTwoUserAlreadyCollectedHDKTokens,
  phaseTwoDepositIsInProgress,
  phaseTwoDepositAmountsEqualToZero,
  phaseTwoTotalHDKTokensOnChain,
  phaseTwoParticipationOnChain,
  phaseTwoDepositBalances,

  phaseThreeCurrentIdForUnlock,
  phaseThreeTotalUserLpTokensAvailableToClaim,
  phaseThreeUserLpTokensClaimed,
  phaseThreeDaysLeft,
  phaseThreeCurrentAvailableLpTokens,
  phaseThreeIsClaimInProgress,

  userLocksTransactions,

  totalUserHdkToClaim,
  isClaimSuccessful,

  totalRewardHDK,
  isClaimHDKInProgress,

  lockdropCurrentPhase,
  lockdropPhaseEndTime,

  lockDropTimeLeft,
  isLockDropTimeFinished,

  totalUserCapitalLockInUSD,

  lockdropTotalValueLockedUSD,
  lockdropTotalWithWeights,
}
