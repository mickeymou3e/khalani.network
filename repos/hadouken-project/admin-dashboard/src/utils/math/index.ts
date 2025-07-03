import { BigNumber } from 'ethers'

import { MAX_BIG_NUMBER } from '@constants/Ethereum'
import { HEALTH_FACTOR_DECIMAL, PERCENTAGE_DECIMAL } from '@constants/Lending'
import { IReserve } from '@graph/pools/types'
import {
  ATokenAsset,
  IUser,
  StableDebtTokenAsset,
  VariableDebtTokenAsset,
} from '@graph/users/types'
import { IPrice } from '@store/prices/prices.slice'
import { TokenBalance } from '@store/users/users.types'

const RAY = BigNumber.from(10).pow(27)
const HALF_RAY = RAY.div(2)
const SECONDS_PER_YEAR = 31556926

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

export const getHealthFactor = (
  user: IUser,
  reserves: IReserve[],
  prices: IPrice[],
): {
  healthFactor: BigNumber
  collateralTokens: TokenBalance[]
  borrowedTokens: TokenBalance[]
} => {
  if (!user.stableBorrowAssets && !user.variableBorrowAssets) {
    return {
      healthFactor: MAX_BIG_NUMBER,
      collateralTokens: [], // we don't care about collateral tokens if someone has no borrows
      borrowedTokens: [],
    }
  }
  const { totalCollateral, collateralTokens } = getUserTotalCollateral(
    prices,
    user.aTokenAssets,
    reserves,
    user.id,
  )

  const { totalBorrow, borrowedTokens } = calculateBorrow(
    user.variableBorrowAssets,
    user.stableBorrowAssets,
    reserves,
    prices,
    user.id,
  )
  const liquidityThreshold = calculateCurrentLiquidityThreshold(
    totalCollateral,
    user.aTokenAssets,
    reserves,
    prices,
  )

  const healthFactor = calculateHealthFactor(
    totalBorrow,
    totalCollateral,
    liquidityThreshold,
  )

  return { healthFactor, borrowedTokens, collateralTokens }
}

// Return health factor in WEI
export const calculateHealthFactor = (
  totalBorrow: BigNumber, // in WEI
  userTotalCollateral: BigNumber, // in WEI
  userCurrentLiquidationThreshold: BigNumber, // 4 decimals
): BigNumber => {
  if (totalBorrow.gt(0)) {
    return userTotalCollateral
      .mul(userCurrentLiquidationThreshold)
      .mul(BigNumber.from(10).pow(HEALTH_FACTOR_DECIMAL))
      .div(totalBorrow)
      .div(BigNumber.from(10).pow(PERCENTAGE_DECIMAL))
  }

  return MAX_BIG_NUMBER
}

const getUserTotalCollateral = (
  prices: IPrice[],
  depositBalances: ATokenAsset[],
  reserves: IReserve[],
  userAddress: string,
): { totalCollateral: BigNumber; collateralTokens: TokenBalance[] } => {
  const collateralTokens: TokenBalance[] = []
  const totalCollateral = depositBalances
    .filter((deposit) => deposit.isCollateral)
    .reduce((data, balance) => {
      const reserve = reserves.find(
        (reserve) => reserve.aTokenAddress === balance.address,
      )
      if (reserve === undefined) {
        console.error(`No reserve found for token ${balance.address}`)
        return data
      }

      const symbol = reserve.symbol.split('.')[0]

      const price = prices.find((price) => price.id === symbol)
      if (!price) {
        console.error(`No price found for token ${reserve.symbol}`)
        return data
      }
      const tokenBalanceWithEarnings = calculateBalanceWithEarnings(
        BigNumber.from(balance.scaledBalance),
        reserve.liquidityIndex,
        reserve.liquidityRate,
        reserve.lastUpdateTimestamp,
      )
      const tokenUnit = BigNumber.from(10).pow(reserve.decimals)
      const assetCollateral = tokenBalanceWithEarnings
        .mul(price.price)
        .div(tokenUnit)

      if (assetCollateral.gt(BigNumber.from(0))) {
        collateralTokens.push({
          symbol,
          balanceInDollars: assetCollateral,
          id: balance.id,
          balance: tokenBalanceWithEarnings,
          tokenAddress: balance.address,
          walletAddress: userAddress,
          decimals: reserve.decimals,
        })
      }

      data = data.add(assetCollateral)

      return data
    }, BigNumber.from(0))

  return { totalCollateral, collateralTokens }
}

export const getAmountInDollars = (
  amount: BigNumber,
  price: BigNumber,
  decimals: number,
): BigNumber => {
  const tokenUnit = BigNumber.from(10).pow(decimals)
  const amountInDollars = amount.mul(price).div(tokenUnit)

  return amountInDollars
}

type Balance = {
  balance: BigNumber
  address: string
}

const calculateBorrow = (
  variableDebtTokens: VariableDebtTokenAsset[],
  stableDebtTokens: StableDebtTokenAsset[],
  reserves: IReserve[],
  prices: IPrice[],
  userAddress: string,
): { totalBorrow: BigNumber; borrowedTokens: TokenBalance[] } => {
  const borrowedTokens: TokenBalance[] = []
  let borrowBalances: Balance[] = []
  borrowBalances = borrowBalances.concat(
    variableDebtTokens.map((variableDebtToken) => ({
      balance: BigNumber.from(variableDebtToken.scaledVariableDebt),
      address: variableDebtToken.address,
    })),
    stableDebtTokens.map((stableDebtToken) => ({
      balance: BigNumber.from(stableDebtToken.principalStableDebt),
      address: stableDebtToken.address,
    })),
  )
  const totalBorrow = borrowBalances.reduce((data, balance) => {
    const reserveVariable = reserves.find(
      (reserve) => reserve.variableDebtTokenAddress === balance.address,
    )
    const isVariableDebt = !!reserveVariable
    const reserveStable = reserves.find(
      (reserve) => reserve.stableDebtTokenAddress === balance.address,
    )
    const reserve = isVariableDebt ? reserveVariable : reserveStable
    if (reserve === undefined) return data
    const value = isVariableDebt
      ? calculateVariableDebt(
          balance.balance,
          reserve.variableBorrowRate,
          reserve.variableBorrowIndex,
          reserve.lastUpdateTimestamp,
        )
      : calculateStableDebt(
          balance.balance,
          reserve.stableBorrowRate,
          reserve.lastUpdateTimestamp,
        )

    const symbol = reserve.symbol.split('.')[0]
    const price = prices.find((price) => price.id === symbol)
    if (!price) {
      console.error(`No price found for token ${reserve.symbol}`)
      return data
    }
    const tokenUnit = BigNumber.from(10).pow(reserve.decimals)
    const borrowAmount = value.mul(price.price).div(tokenUnit)

    if (borrowAmount.gt(BigNumber.from(0))) {
      borrowedTokens.push({
        balance: value,
        tokenAddress: balance.address,
        walletAddress: userAddress,
        id: `${balance.address} - ${userAddress}`,
        balanceInDollars: borrowAmount,
        symbol,
        decimals: reserve.decimals,
      })
    }

    data = data.add(borrowAmount)
    return data
  }, BigNumber.from(0))
  return { totalBorrow, borrowedTokens }
}

const calculateCurrentLiquidityThreshold = (
  totalCollateral: BigNumber,
  depositAssets: ATokenAsset[],
  reserves: IReserve[],
  prices: IPrice[],
): BigNumber => {
  const collateralDeposits = depositAssets.filter(
    (depositAsset) => depositAsset.isCollateral,
  )
  const liquidationThreshold = collateralDeposits.reduce(
    (totalLiquidationThreshold, deposit) => {
      const reserve = reserves.find(
        (reserve) => reserve.aTokenAddress === deposit.address,
      )
      const price = prices.find((price) => price.id === reserve?.symbol)

      if (!reserve || !price) return totalLiquidationThreshold

      const tokenUnit = BigNumber.from(10).pow(reserve.decimals)
      const tokenBalanceWithEarnings = calculateBalanceWithEarnings(
        BigNumber.from(deposit.scaledBalance),
        reserve.liquidityIndex,
        reserve.liquidityRate,
        reserve.lastUpdateTimestamp,
      )

      return totalLiquidationThreshold.add(
        price.price
          .mul(tokenBalanceWithEarnings)
          .mul(reserve.liquidityThreshold)
          .div(tokenUnit),
      )
    },
    BigNumber.from(0),
  )

  return totalCollateral.isZero()
    ? BigNumber.from(0)
    : liquidationThreshold.div(totalCollateral)
}
