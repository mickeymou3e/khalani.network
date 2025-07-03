import { BigNumber } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, select, take } from 'typed-redux-saga'

import { getPoolConfig } from '@dataSource/graph/pools/pools/constants'
import { address } from '@dataSource/graph/utils/formatters'
import { balancesActions } from '@store/balances/balances.slice'
import { balancesSelectors } from '@store/balances/selectors/balances.selector'
import { networkSelectors } from '@store/network/network.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { tokensActions } from '@store/tokens/tokens.slice'
import { userSharesSelectors } from '@store/userShares/userShares.selector'
import { userSharesActions } from '@store/userShares/userShares.slice'

import { PoolType } from '../../../../interfaces/pool'
import { BigDecimal, calculatePriceImpactDeposit } from '../../../../utils/math'
import { poolsActions } from '../../../pool/pool.slice'
import {
  IPoolModel,
  ITokenWithWeight,
} from '../../../pool/selectors/models/types'
import { poolSelectors } from '../../../pool/selectors/pool.selector'
import { pricesSelector } from '../../../prices/prices.selector'
import { DepositTokenAmount, IDepositToken } from '../../deposit.types'

export function* waitForPoolsAndTokensBeFetched(): Generator {
  const isFetchingPools = yield* select(poolSelectors.isFetching)
  const isPoolsReady = yield* select(poolSelectors.poolsReady)

  if (isFetchingPools || !isPoolsReady) {
    yield* take(poolsActions.updateSuccess)
  }

  const isTokensReady = yield* select(tokenSelectors.isReady)
  const isFetchingTokens = yield* select(tokenSelectors.isFetching)

  if (isFetchingTokens || !isTokensReady) {
    yield* take(tokensActions.updateTokensSuccess)
  }
}

export function* waitForUserBalanceBeFetched(): Generator {
  const isUserBalanceFetched = yield* select(
    balancesSelectors.isUserBalanceFetched,
  )

  if (!isUserBalanceFetched) {
    yield* take(balancesActions.updateUserBalanceSuccess)
  }
}

export function* waitForUserShareBeFetched(): Generator {
  const isFetching = yield* select(userSharesSelectors.isFetching)

  if (isFetching) {
    yield* take(userSharesActions.updateUserSharesSuccess)
  }
}

export const calcProportionalAmounts = (
  pool: {
    id: string
    tokens: { address: string; balance: BigNumber; decimals: number }[]
  },
  tokenAddress: string,
  amount: BigNumber,
): {
  address: string
  proportionalAmount: BigNumber
  decimals: number
}[] => {
  const tokensWithoutBpt = pool.tokens.filter(
    (token) => !address(pool.id).includes(address(token.address)),
  )
  const referenceTokenIndex = tokensWithoutBpt.findIndex(
    (token) => address(token.address) === address(tokenAddress),
  )

  if (referenceTokenIndex === -1) {
    throw new Error('Token not found in pool')
  }

  const balances = tokensWithoutBpt.map((token) => token.balance)

  const proportionalAmounts = balances.map((balance) =>
    balance.mul(amount).div(balances[referenceTokenIndex]),
  )

  return tokensWithoutBpt.map((token, index) => ({
    address: token.address,
    decimals: token.decimals,
    proportionalAmount: proportionalAmounts[index],
  }))
}

export const calculateProportionalDepositAmounts = (
  inputValue: IDepositToken,
  inputBalance: BigDecimal,
  tokens: {
    address: string
    balance: BigDecimal
    decimals: number
  }[],
  poolModel: IPoolModel,
): DepositTokenAmount[] => {
  const newDepositAmounts: DepositTokenAmount[] = []

  if (inputValue) {
    for (const token of tokens) {
      if (token.address === inputValue.address) {
        newDepositAmounts.push({
          address: inputValue.address,
          amount: inputValue.amount ?? BigNumber.from(0),
          decimals: inputValue.decimals,
        })
      } else {
        const pool = {
          id: address(poolModel.id),
          tokens: poolModel.pool.tokens.map((poolToken) => ({
            address: address(poolToken.address),
            balance: poolToken.balance.toBigNumber(),
            decimals: poolToken.decimals,
          })),
        }
        const proportionalTokens = calcProportionalAmounts(
          pool,
          inputValue.address,
          inputValue?.amount ?? BigNumber.from(0),
        )

        proportionalTokens.forEach((token) => {
          newDepositAmounts.push({
            address: token.address,
            amount: token.proportionalAmount,
            decimals: token.decimals,
          })
        })
      }
    }
  }
  return newDepositAmounts
}

export const shouldDepositButtonBeDisabled = (
  deposits: IDepositToken[],
  depositTokensBalances: {
    [key: string]: BigDecimal | null | undefined
  } | null,
): boolean => {
  return (
    isTokenValueOvertTheBalance(deposits, depositTokensBalances) ||
    allTokenValuesAreEmpty(deposits)
  )
}

export function getPoolDepositTokens(
  poolModel: IPoolModel,
  chainId: string,
  wrappedTokens?: boolean,
): ITokenWithWeight[] {
  const poolConfig = getPoolConfig(poolModel.address, chainId)

  if (wrappedTokens) {
    if (poolConfig?.wrappedDepositTokens) {
      return poolModel.allTokens.filter((token) =>
        poolConfig?.wrappedDepositTokens?.some(
          (tokenAddress) => address(tokenAddress) === address(token.address),
        ),
      )
    }
  }

  if (poolConfig?.depositTokens) {
    return poolModel.allTokens.filter((token) =>
      poolConfig?.depositTokens?.some(
        (tokenAddress) => address(tokenAddress) === address(token.address),
      ),
    )
  }

  return poolModel.depositTokens ?? []
}

export function* getPoolTotalValue(
  depositTokens: IDepositToken[],
): Generator<StrictEffect, BigDecimal> {
  const priceSelectorByIds = yield* select(pricesSelector.selectManyByIds)
  const prices = priceSelectorByIds(depositTokens.map((token) => token.address))

  const totalDepositValueUSD =
    depositTokens?.reduce((totalDepositValue, deposit) => {
      const price =
        prices.find((price) => price?.id === deposit.address)?.price ??
        BigDecimal.from(0)

      const amountUSD = deposit?.amount
        ? BigDecimal.from(deposit.amount, deposit.decimals).mul(price)
        : BigDecimal.from(0)

      return totalDepositValue.add(amountUSD)
    }, BigDecimal.from(0)) ?? BigDecimal.from(0)

  return totalDepositValueUSD
}

export function* calculatePriceImpact(
  depositTokens: IDepositToken[],
  poolId: string,
  userAddress: string,
  poolType?: PoolType,
): Generator<StrictEffect, string> {
  const tokensBalances = depositTokens.map((deposit) => ({
    value: BigDecimal.from(
      deposit.amount || BigNumber.from(0),
      deposit.decimals,
    ),
    tokenAddress: deposit.address,
  }))

  const chainId = yield* select(networkSelectors.applicationChainId)

  if (poolType === PoolType.Weighted) {
    return yield* call(calculatePriceImpactDeposit, {
      depositAmounts: tokensBalances,
      poolId,
      chainId,
      userAddress,
    })
  }

  return '0.00%'
}

const isDepositGreaterThanZero = (deposit: IDepositToken): boolean => {
  return deposit.amount ? deposit.amount?.gt(0) : false
}

const isDepositGraterThanTokenBalance = (
  deposit: IDepositToken,
  balance: BigDecimal | null,
): boolean => {
  const value = BigDecimal.from(
    deposit?.amount || BigNumber.from(0),
    deposit.decimals,
  )

  return balance ? balance?.lt(value) : true
}

const allTokenValuesAreEmpty = (deposits: IDepositToken[]) =>
  deposits.every((deposit) => !isDepositGreaterThanZero(deposit))

const isTokenValueOvertTheBalance = (
  deposits: IDepositToken[],
  depositTokensBalances: {
    [key: string]: BigDecimal | null | undefined
  } | null,
) => {
  return deposits.some((deposit) => {
    const tokenBalance = depositTokensBalances?.[deposit?.address] ?? null

    return (
      isDepositGreaterThanZero(deposit) &&
      isDepositGraterThanTokenBalance(deposit, tokenBalance)
    )
  })
}
