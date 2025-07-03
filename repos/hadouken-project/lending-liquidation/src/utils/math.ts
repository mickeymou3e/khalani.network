import { BigNumber } from 'ethers'
import {
  DepositAsset,
  LiquidityThresholdCalculationParams,
  Reserve,
  Price,
  TokenBalance,
  User,
  DebtReserve,
  CollateralReserve,
  MaxCollateral,
} from '../interface'
import {
  ETH_DECIMALS,
  HALF_PERCENT,
  HALF_RAY,
  LIQUIDATION_CLOSE_FACTOR_PERCENT,
  MAX_BIG_NUMBER,
  PERCENTAGE_DECIMAL,
  PERCENTAGE_FACTOR,
  PRICE_DECIMALS,
  RAY,
  SECONDS_PER_YEAR,
} from './constants'

const addDecimals = (value: BigNumber, decimalsToAdd: number): BigNumber =>
  value.mul(BigNumber.from(10).pow(decimalsToAdd))

// Multiply 2 numbers of 1e27
const rayMul = (a: BigNumber, b: BigNumber): BigNumber => {
  if (a.eq(0) || b.eq(0)) {
    return BigNumber.from(0)
  }

  return a.mul(b).add(HALF_RAY).div(RAY)
}

export const convertBigNumberToDecimal = (
  value: BigNumber,
  decimals: number,
): string => {
  if (!value || value.eq(0)) {
    return `0.${'0'.repeat(decimals)}`
  }

  const integerDecimal = value.toString()

  const isMoreNumbersInIntegerThenDecimalSupport = () =>
    integerDecimal.length > decimals

  if (isMoreNumbersInIntegerThenDecimalSupport()) {
    return (
      integerDecimal.slice(0, integerDecimal.length - decimals) +
      '.' +
      integerDecimal.slice(integerDecimal.length - decimals)
    )
  } else {
    const additionalZeros = decimals - integerDecimal.length
    const decimal = `0.${'0'.repeat(additionalZeros)}` + integerDecimal
    const decimalWithRemovedZerosAtTheEnd = decimal.replace(/0+$/, '')
    return decimalWithRemovedZerosAtTheEnd
  }
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

export const calculateMaxCollateralToLiquidate = (
  debtToken: DebtReserve,
  collateralToken: CollateralReserve,
  prices: Price[],
): MaxCollateral => {
  const possibleDebtToCover = debtToken.totalDebt
    .mul(LIQUIDATION_CLOSE_FACTOR_PERCENT)
    .add(HALF_PERCENT)
    .div(PERCENTAGE_FACTOR)

  const debtSymbol = debtToken.symbol.split('.')[0]
  const collateralSymbol = collateralToken.symbol.split('.')[0]

  const debtPrice = prices.find((price) => price.symbol === debtSymbol)

  const collateralPrice = prices.find(
    (price) => price.symbol === collateralSymbol,
  )

  console.log(collateralToken.liquidityBonus.toString())
  if (collateralPrice && debtPrice) {
    console.log(
      `possible To cover ${debtToken.symbol}`,
      `${convertBigNumberToDecimal(possibleDebtToCover, debtToken.decimals)} [${
        debtToken.symbol
      }]`,
      `${convertBigNumberToDecimal(
        possibleDebtToCover
          .mul(BigNumber.from(10).pow(ETH_DECIMALS - debtToken.decimals))
          .mul(debtPrice?.rate)
          .div(BigNumber.from(10).pow(PRICE_DECIMALS)),
        18,
      )} $`,
    )

    console.log(
      `debtPrice ${debtPrice.symbol} ${convertBigNumberToDecimal(
        debtPrice.rate,
        9,
      )} $`,
    )
    console.log(
      `collateralPrice, ${collateralPrice.symbol} ${convertBigNumberToDecimal(
        collateralPrice.rate,
        9,
      )} $`,
    )

    console.log(
      'liquidity bonus',
      convertBigNumberToDecimal(
        collateralToken.liquidityBonus.sub(BigNumber.from(PERCENTAGE_FACTOR)),
        2,
      ),
      '%',
    )

    const maxAmountCollateralToLiquidate = debtPrice.rate
      .mul(possibleDebtToCover)
      .mul(BigNumber.from(10).pow(collateralToken.decimals))
      .mul(collateralToken.liquidityBonus)
      .add(HALF_PERCENT)

      .div(BigNumber.from(PERCENTAGE_FACTOR))

      .div(collateralPrice.rate.mul(BigNumber.from(10).pow(debtToken.decimals)))

    console.log(
      'max collateral to gain',
      maxAmountCollateralToLiquidate.toString(),
      convertBigNumberToDecimal(
        maxAmountCollateralToLiquidate,
        collateralToken.decimals,
      ),

      convertBigNumberToDecimal(
        maxAmountCollateralToLiquidate
          .mul(BigNumber.from(10).pow(ETH_DECIMALS - collateralToken.decimals))
          .mul(collateralPrice?.rate)
          .div(BigNumber.from(10).pow(PRICE_DECIMALS)),
        18,
      ),

      '$',
    )

    if (maxAmountCollateralToLiquidate.gt(collateralToken.totalCollateral)) {
      return {
        maxAmountCollateralToLiquidate: collateralToken.totalCollateral,
        maxAmountCollateralToLiquidateInDollars: collateralToken.totalCollateral
          .mul(BigNumber.from(10).pow(ETH_DECIMALS - collateralToken.decimals))
          .mul(collateralPrice.rate),
      }
    } else {
      return {
        maxAmountCollateralToLiquidate: maxAmountCollateralToLiquidate,
        maxAmountCollateralToLiquidateInDollars: maxAmountCollateralToLiquidate
          .mul(BigNumber.from(10).pow(ETH_DECIMALS - collateralToken.decimals))
          .mul(collateralPrice.rate),
      }
    }
  }

  return {
    maxAmountCollateralToLiquidate: BigNumber.from(0),
    maxAmountCollateralToLiquidateInDollars: BigNumber.from(0),
  }
}

export const getHealthFactor = (
  user: User,
  reserves: Reserve[],
  tokenBalances: TokenBalance[],
  prices: Price[],
): {
  healthFactor: BigNumber
  collateralTokens: CollateralReserve[]
  borrowedTokens: DebtReserve[]
} => {
  const { totalCollateral, collateralTokens } = getUserTotalCollateral(
    prices,
    user.depositAssets,
    reserves,
  )

  const { totalDebt, borrowedTokens } = getTotalDebt(
    user.id,
    tokenBalances,
    reserves,
    prices,
  )
  const LiquidityThreshold = calculateCurrentLiquidityThreshold(
    user.depositAssets,
    reserves,
  )

  const healthFactor = calculateHealthFactor(
    totalDebt,
    totalCollateral,
    LiquidityThreshold,
  )

  return { healthFactor, borrowedTokens, collateralTokens }
}

// Return health factor in WEI
const calculateHealthFactor = (
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

const getUserTotalCollateral = (
  prices: Array<Price>,
  depositBalances: Array<DepositAsset>,
  reserves: Array<Reserve>,
): { totalCollateral: BigNumber; collateralTokens: CollateralReserve[] } => {
  const collateralTokens: CollateralReserve[] = []
  const totalCollateral = depositBalances
    .filter((deposit) => deposit.isCollateral)
    .reduce((data, balance) => {
      const reserve = reserves.find(
        (reserve) =>
          reserve.aTokenAddress === balance.tokenBalance.tokenAddress,
      )
      if (reserve === undefined) return BigNumber.from(0)

      const symbol = reserve.symbol.split('.')[0]

      const price = prices.find((price) => price.symbol === symbol)
      const tokenBalanceWithEarnings = calculateBalanceWithEarnings(
        balance.tokenBalance.balance,
        reserve.liquidityIndex,
        reserve.liquidityRate,
        reserve.lastUpdateTimestamp,
      )
      const assetCollateral = tokenBalanceWithEarnings
        .mul(BigNumber.from(10).pow(ETH_DECIMALS - reserve.decimals))
        .mul(price!.rate)
        .div(BigNumber.from(10).pow(PRICE_DECIMALS))

      if (assetCollateral.gt(BigNumber.from(0))) {
        collateralTokens.push({
          ...reserve,
          totalCollateralInDollars: assetCollateral,
          totalCollateral: BigNumber.from(balance.tokenBalance.balance),
        })
      }

      data = data.add(assetCollateral)

      return data
    }, BigNumber.from(0))

  return { totalCollateral, collateralTokens }
}

export const getTotalDebt = (
  userToBeLiquidatedAddress: string,
  tokenBalances: TokenBalance[],
  reserves: Reserve[],
  prices: Price[],
): { totalDebt: BigNumber; borrowedTokens: DebtReserve[] } => {
  const VTokens: Array<string> = reserves.map(
    (reserve) => reserve.variableDebtTokenAddress,
  )
  const STokens: Array<string> = reserves.map(
    (reserve) => reserve.stableDebtTokenAddress,
  )
  const userBalances = tokenBalances.filter(
    (e) => e.walletAddress === userToBeLiquidatedAddress,
  )
  const userVTokens = userBalances.filter((e) =>
    VTokens.includes(e.tokenAddress),
  )
  const userSTokens = userBalances.filter((e) =>
    STokens.includes(e.tokenAddress),
  )
  const userDebtTokens = userVTokens.concat(userSTokens)
  const { totalDebt, borrowedTokens } = calculateBorrow(
    userDebtTokens,
    reserves,
    prices,
  )

  return { totalDebt, borrowedTokens }
}

const calculateBorrow = (
  borrowBalances: TokenBalance[],
  reserves: Reserve[],
  prices: Price[],
): { totalDebt: BigNumber; borrowedTokens: DebtReserve[] } => {
  const borrowedTokens: DebtReserve[] = []
  const totalDebt = borrowBalances.reduce((data, balance) => {
    const reserveVariable = reserves.find(
      (reserve) => reserve.variableDebtTokenAddress === balance.tokenAddress,
    )
    const isVariableDebt = !!reserveVariable
    const reserveStable = reserves.find(
      (reserve) => reserve.stableDebtTokenAddress === balance.tokenAddress,
    )
    const reserve = isVariableDebt ? reserveVariable : reserveStable
    if (reserve === undefined) return BigNumber.from(0)
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
    const price = prices.find((price) => price.symbol === symbol)
    const borrowAmount = value
      .mul(BigNumber.from(10).pow(ETH_DECIMALS - reserve.decimals))
      .mul(price!.rate)
      .div(BigNumber.from(10).pow(PRICE_DECIMALS))

    if (borrowAmount.gt(BigNumber.from(0))) {
      borrowedTokens.push({
        ...reserve,
        totalDebt: value,
        totalDebtInDollars: borrowAmount,
      })
    }

    data = data.add(borrowAmount)
    return data
  }, BigNumber.from(0))
  return { totalDebt, borrowedTokens }
}

const getLiquidityThresholdParams = (
  depositAssets: DepositAsset[],
  reserves: Reserve[],
): LiquidityThresholdCalculationParams[] =>
  depositAssets.map((deposit) => {
    const { isCollateral } = deposit
    const reserve = reserves.find(
      (reserve) => reserve.aTokenAddress === deposit.tokenBalance.tokenAddress,
    )
    const newLiquidityThresholdParam: LiquidityThresholdCalculationParams = {
      isCollateral,
      symbol: reserve!.symbol,
      liquidityThreshold: reserve!.liquidityThreshold,
      value: deposit.tokenBalance.balance,
    }
    return newLiquidityThresholdParam
  })

const calculateCurrentLiquidityThreshold = (
  depositAssets: DepositAsset[],
  reserves: Reserve[],
): BigNumber => {
  const liquidityThresholdParams = getLiquidityThresholdParams(
    depositAssets,
    reserves,
  )
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
