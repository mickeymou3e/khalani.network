import { BigNumber } from 'ethers'

import { MAX_BIG_NUMBER } from '@constants/Ethereum'
import {
  CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS,
  ETH_DECIMALS,
  HEALTH_FACTOR_DECIMAL,
  PERCENTAGE_DECIMAL,
} from '@constants/Lending'
import { IUserAccountData } from '@store/userData/userData.types'

import {
  IReserve,
  ITokenValueWithNameAndCollateral,
} from '../../interfaces/tokens'
import { LiquidityThresholdCalculationParams } from '../../pages/Dashboard/Dashboard.types'

const RAY = BigNumber.from(10).pow(27)
const HALF_RAY = RAY.div(2)
const SECONDS_PER_YEAR = 31556926
export const ONE_HEALTH_FACTOR = BigNumber.from(10).pow(HEALTH_FACTOR_DECIMAL)
const MIN_HF_AT_WITHDRAW = ONE_HEALTH_FACTOR.mul(101).div(100)

// Multiply 2 numbers of 1e27
const rayMul = (a: BigNumber, b: BigNumber): BigNumber => {
  if (a.eq(0) || b.eq(0)) {
    return BigNumber.from(0)
  }

  return a.mul(b).add(HALF_RAY).div(RAY)
}

// /**
//  * @dev Function to calculate the interest using a compounded interest rate formula
//  * To avoid expensive exponentiation, the calculation is performed using a binomial approximation:
//  *
//  *  (1+x)^n = 1+n*x+[n/2*(n-1)]*x^2+[n/6*(n-1)*(n-2)*x^3...
//  *
//  * The approximation slightly underpays liquidity providers and undercharges borrowers, with the advantage of great gas cost reductions
//  * The whitepaper contains reference to the approximation and a table showing the margin of error per different time periods
//  *
//  * @param rate The interest rate, in ray
//  * @param lastUpdateTimestamp The timestamp of the last update of the interest
//  * @return The interest rate compounded during the timeDelta, in ray
//  **/
const calculateCompoundedInterest = (
  rate: BigNumber,
  lastUpdateTimestamp: BigNumber,
) => {
  const currentTimeStamp = BigNumber.from(Date.now()).div(1000)

  const exp = currentTimeStamp.sub(lastUpdateTimestamp)

  if (exp.eq(0)) {
    return RAY
  }

  const expMinusOne = exp.sub(1)
  const expMinusTwo = exp.gt(2) ? exp.sub(2) : BigNumber.from(0)

  const ratePerSecond = rate.div(SECONDS_PER_YEAR)

  const basePowerTwo = rayMul(ratePerSecond, ratePerSecond)
  const basePowerThree = rayMul(basePowerTwo, ratePerSecond)

  const secondTerm = exp.mul(expMinusOne).mul(basePowerTwo).div(2)
  const thirdTerm = exp
    .mul(expMinusOne)
    .mul(expMinusTwo)
    .mul(basePowerThree)
    .div(6)

  const compoundedInterest = RAY.add(ratePerSecond.mul(exp))
    .add(secondTerm)
    .add(thirdTerm)

  return compoundedInterest
}

const calculateLinearInterest = (
  rate: BigNumber,
  lastAssetActionTimestamp: BigNumber,
): BigNumber => {
  const currentTimeStamp = BigNumber.from(Date.now()).div(1000)
  const timeDifference = currentTimeStamp.sub(lastAssetActionTimestamp)

  return rate.mul(timeDifference).div(SECONDS_PER_YEAR).add(RAY)
}

export const calculateBalanceWithEarnings = (
  tokenBalance: BigNumber,
  liquidityIndex: BigNumber,
  rate: BigNumber,
  lastAssetActionTimestamp: BigNumber,
): BigNumber => {
  if (rate.eq(0)) return tokenBalance
  const linearInterest = calculateLinearInterest(rate, lastAssetActionTimestamp)
  const normalizeIncome = rayMul(linearInterest, liquidityIndex)

  return rayMul(tokenBalance, normalizeIncome)
}

export const calculateStableDebt = (
  tokenBalance: BigNumber,
  stableBorrowRate: BigNumber,
  lastUpdateTimestamp: BigNumber,
): BigNumber => {
  const compoundedInterest = calculateCompoundedInterest(
    stableBorrowRate,
    lastUpdateTimestamp,
  )

  return rayMul(tokenBalance, compoundedInterest)
}

export const calculateVariableDebt = (
  tokenBalance: BigNumber,
  variableBorrowRate: BigNumber,
  variableBorrowIndex: BigNumber,
  lastUpdateTimestamp: BigNumber,
): BigNumber => {
  const compoundedInterest = calculateCompoundedInterest(
    variableBorrowRate,
    lastUpdateTimestamp,
  )
  const cumulated = rayMul(compoundedInterest, variableBorrowIndex)

  return rayMul(tokenBalance, cumulated)
}

export const addDecimals = (
  value: BigNumber,
  decimalsToAdd: number,
): BigNumber => value.mul(BigNumber.from(10).pow(decimalsToAdd))

// Return health factor in WEI
export const calculateHealthFactor = (
  totalBorrow: BigNumber, // in WEI
  userTotalCollateral: BigNumber, // in WEI
  userCurrentLiquidationThreshold: BigNumber, // 4 decimals
): BigNumber => {
  if (totalBorrow.gt(0)) {
    return addDecimals(
      userTotalCollateral.mul(userCurrentLiquidationThreshold).div(totalBorrow),
      ETH_DECIMALS - PERCENTAGE_DECIMAL,
    )
  }

  return MAX_BIG_NUMBER
}

export const calculateUserAssetMaxBorrowAmount = (
  userTotalCollateral: IUserAccountData['totalCollateral'],
  userTotalBorrow: IUserAccountData['totalBorrow'],
  userLTV: IUserAccountData['ltv'],
  assetDecimals: number,
  availableLiquidity: BigNumber,
  tokenPrice: BigNumber,
  totalBorrowed: BigNumber,
  borrowCap: BigNumber,
): { availableBorrow: BigNumber; borrowIsCapped: boolean } => {
  // TOTAL_BORROW = TOTAL_COLLATERAL * USER_LTV / 1.07
  // TOTAL_BORROW - USER_TOTAL_BORROW = ASSET_MAX_BORROW_AMOUNT

  const userBorrowLimit = userTotalCollateral
    .mul(userLTV)
    .div(BigNumber.from(10).pow(16).mul(107))
    .mul(BigNumber.from(10).pow(ETH_DECIMALS - 4))

  const assetMaxBorrowInDollars = userBorrowLimit.gt(userTotalBorrow)
    ? userBorrowLimit
        .sub(userTotalBorrow)
        .div(BigNumber.from(10).pow(ETH_DECIMALS - assetDecimals))
    : BigNumber.from(0)

  const userBorrowPower = tokenPrice.gt(0)
    ? assetMaxBorrowInDollars
        .mul(BigNumber.from(10).pow(CURRENT_GET_ASSET_PRICE_IN_ORACLE_DECIMALS))
        .div(tokenPrice)
    : assetMaxBorrowInDollars
  const availableToBorrow = userBorrowPower.gt(availableLiquidity)
    ? availableLiquidity
    : userBorrowPower

  const cappedAvailableToBorrow = maxAmountWithCap(
    totalBorrowed,
    borrowCap,
    availableToBorrow,
  )
  const borrowIsCapped = availableToBorrow.gt(cappedAvailableToBorrow)

  return { availableBorrow: cappedAvailableToBorrow, borrowIsCapped }
}

export const calculateUserAssetMaxWithdrawAmount = (
  deposit?: ITokenValueWithNameAndCollateral | null,
  reserve?: IReserve | null,
  userData?: IUserAccountData,
  tokenPrice?: BigNumber,
  expectedHealthFactor: BigNumber = MIN_HF_AT_WITHDRAW,
) => {
  if (!deposit || !reserve) return BigNumber.from(0)
  const availableLiquidity = deposit.value.gt(reserve.availableLiquidity)
    ? reserve.availableLiquidity
    : deposit.value

  const isCollateral =
    deposit?.isCollateral && !reserve?.ltv.eq(BigNumber.from(0))

  if (!userData || !tokenPrice || !isCollateral) return availableLiquidity

  const percentageMultiplier = BigNumber.from(10).pow(PERCENTAGE_DECIMAL)
  const totalAvailableToBorrowInUSD = userData.totalCollateral.mul(
    userData.currentLiquidationThreshold,
  )
  const totalDebtInUSDMultiplied = userData.totalBorrow
    .mul(percentageMultiplier)
    .mul(expectedHealthFactor)
    .div(ONE_HEALTH_FACTOR)

  const amountToReachLiquidation = totalAvailableToBorrowInUSD
    .sub(totalDebtInUSDMultiplied)
    .mul(BigNumber.from(10).pow(reserve.decimals))
    .div(userData.currentLiquidationThreshold)
    .div(tokenPrice)

  if (amountToReachLiquidation.lte(BigNumber.from(0))) return BigNumber.from(0)
  return availableLiquidity.gt(amountToReachLiquidation)
    ? amountToReachLiquidation
    : availableLiquidity
}

export const maxAmountWithCap = (
  poolAmount?: BigNumber,
  limit?: BigNumber,
  userBalance?: BigNumber,
): BigNumber => {
  if (!userBalance || !poolAmount || !limit) return BigNumber.from(0)
  if (limit.eq(BigNumber.from(0))) return userBalance

  const nextPoolAmount = poolAmount.add(userBalance)

  if (nextPoolAmount.gt(limit))
    return subSlippageFromValue(limit.sub(poolAmount), 1)

  return userBalance
}

export const calculateCurrentLiquidityThreshold = (
  liquidityThresholdParams: LiquidityThresholdCalculationParams[],
): BigNumber => {
  const liquidityThresholdParamsForCollateralReserves = liquidityThresholdParams.filter(
    (x) => x.isCollateral,
  )

  const currentTotalCollateral = liquidityThresholdParamsForCollateralReserves.reduce(
    (totalCollateral, param) => {
      totalCollateral = totalCollateral.add(param.value)
      return totalCollateral
    },
    BigNumber.from(0),
  )

  const liquidityThresholdSum = liquidityThresholdParamsForCollateralReserves.reduce(
    (liquidityThresholdSum, param) => {
      liquidityThresholdSum = liquidityThresholdSum.add(
        param.value.mul(param.liquidityThreshold),
      )

      return liquidityThresholdSum
    },
    BigNumber.from(0),
  )

  const currentLiquidityThreshold = currentTotalCollateral.gt(0)
    ? liquidityThresholdSum.div(currentTotalCollateral)
    : BigNumber.from(0)

  return currentLiquidityThreshold
}

export interface LTVCalculationParams {
  value: BigNumber
  ltv: BigNumber
}
export const calculateNewMaxLTV = (
  LTVParams: LTVCalculationParams[],
): BigNumber => {
  const currentTotalCollateral = LTVParams.reduce((totalCollateral, param) => {
    totalCollateral = totalCollateral.add(param.value)
    return totalCollateral
  }, BigNumber.from(0))

  const LTVSum = LTVParams.reduce((LTVSum, param) => {
    LTVSum = LTVSum.add(param.value.mul(param.ltv))

    return LTVSum
  }, BigNumber.from(0))

  const currentLTV = currentTotalCollateral.gt(0)
    ? LTVSum.div(currentTotalCollateral)
    : BigNumber.from(0)

  return currentLTV
}

export const addSlippageToValue = (
  value: BigNumber,
  slippage: number,
): BigNumber => {
  if (slippage === 0) return value

  if (slippage < 0.01) return value

  return value.mul(10000 + slippage * 100).div(10000)
}

export const subSlippageFromValue = (
  value: BigNumber,
  slippage: number,
): BigNumber => {
  if (slippage === 0) return value

  if (slippage < 0.01) return value

  const result = value.mul(10000 - slippage * 100).div(10000)
  return result.gt(BigNumber.from(0)) ? result : BigNumber.from(0)
}
