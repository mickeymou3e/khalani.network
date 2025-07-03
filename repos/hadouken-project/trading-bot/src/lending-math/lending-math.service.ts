import { Injectable, Logger } from '@nestjs/common'
import {
  ATokenAsset,
  Balance,
  Price,
  Reserve,
  StableDebtTokenAsset,
  User,
  VariableDebtTokenAsset,
} from '../liquidation-fetcher/liquidation-fetcher.types'
import {
  CollateralReserve,
  DebtReserve,
  HealthFactor,
  MaxCollateral,
  UserTotalCollateral,
} from './lending-math.types'
import { BigNumber } from 'ethers'
import {
  HALF_PERCENT,
  HALF_RAY,
  HEALTH_FACTOR_DECIMAL,
  LIQUIDATION_CLOSE_FACTOR_PERCENT,
  MAX_BIG_NUMBER,
  PERCENTAGE_DECIMAL,
  PERCENTAGE_FACTOR,
  RAY,
  SECONDS_PER_YEAR,
} from './lending-math.constants'

@Injectable()
export class LendingMathService {
  private readonly logger = new Logger(LendingMathService.name)

  public fixUserCollateral(user: User, reserves: Reserve[]): User {
    const newATokenAssets = user.aTokenAssets.map((aTokenAsset) => {
      const reserve = reserves.find(
        (res) => res.aTokenAddress === aTokenAsset.address,
      )
      if (reserve && BigNumber.from(reserve.ltv).isZero()) {
        return {
          ...aTokenAsset,
          isCollateral: false,
        }
      }
      return aTokenAsset
    })

    return {
      ...user,
      aTokenAssets: newATokenAssets,
    }
  }

  public getHealthFactor(
    user: User,
    reserves: Reserve[],
    prices: Price[],
  ): HealthFactor {
    if (!user.stableBorrowAssets && !user.variableBorrowAssets) {
      return {
        healthFactor: MAX_BIG_NUMBER,
        collateralTokens: [], // we don't care about collateral tokens if someone has no borrows
        borrowedTokens: [],
      }
    }
    const { totalCollateral, collateralTokens } = this.getUserTotalCollateral(
      prices,
      user.aTokenAssets,
      reserves,
    )

    const { totalBorrow, borrowedTokens } = this.calculateBorrow(
      user.variableBorrowAssets,
      user.stableBorrowAssets,
      reserves,
      prices,
    )

    const liquidityThreshold = this.calculateCurrentLiquidityThreshold(
      totalCollateral,
      user.aTokenAssets,
      reserves,
      prices,
    )

    const healthFactor = this.calculateHealthFactor(
      totalBorrow,
      totalCollateral,
      liquidityThreshold,
    )

    return { healthFactor, borrowedTokens, collateralTokens }
  }

  public getUserTotalCollateral(
    prices: Price[],
    depositBalances: ATokenAsset[],
    reserves: Reserve[],
  ): UserTotalCollateral {
    const collateralTokens: CollateralReserve[] = []
    const totalCollateral = depositBalances
      .filter((deposit) => deposit.isCollateral)
      .reduce((data, balance) => {
        const reserve = reserves.find(
          (reserve) => reserve.aTokenAddress === balance.address,
        )
        if (!reserve) {
          this.logger.error(`No reserve found for token ${reserve.symbol}`)
          return data
        }

        const price = prices.find((price) => price.symbol === reserve.symbol)
        if (!price) {
          this.logger.error(`No price found for token ${reserve.symbol}`)
          return data
        }
        const tokenBalanceWithEarnings = this.calculateBalanceWithEarnings(
          balance.scaledBalance,
          reserve.liquidityIndex,
          reserve.liquidityRate,
          reserve.lastUpdateTimestamp,
        )
        const tokenUnit = BigNumber.from(10).pow(reserve.decimals)
        const assetCollateral = tokenBalanceWithEarnings
          .mul(price.rate)
          .div(tokenUnit)

        if (assetCollateral.gt(BigNumber.from(0))) {
          collateralTokens.push({
            ...reserve,
            totalCollateralInDollars: assetCollateral,
            totalCollateral: tokenBalanceWithEarnings,
          })
        }

        data = data.add(assetCollateral)

        return data
      }, BigNumber.from(0))

    return { totalCollateral, collateralTokens }
  }

  public calculateMaxCollateralToLiquidate(
    debtToken: DebtReserve,
    collateralToken: CollateralReserve,
    prices: Price[],
  ): MaxCollateral {
    const debtSymbol = debtToken.symbol
    const debtPrice = prices.find((price) => price.symbol === debtSymbol)
    const debtTokenUnit = BigNumber.from(10).pow(debtToken.decimals)

    const possibleDebtToCover = debtToken.totalDebt
      .mul(LIQUIDATION_CLOSE_FACTOR_PERCENT)
      .add(HALF_PERCENT)
      .div(PERCENTAGE_FACTOR)

    if (!debtPrice) throw new Error(`No oracle price for token ${debtSymbol}`)
    const collateralSymbol = collateralToken.symbol

    const collateralPrice = prices.find(
      (price) => price.symbol === collateralSymbol,
    )

    const collateralTokenUnit = BigNumber.from(10).pow(collateralToken.decimals)

    if (collateralPrice && debtPrice) {
      const maxAmountCollateralToLiquidate = debtPrice.rate
        .mul(possibleDebtToCover)
        .mul(collateralTokenUnit)
        .mul(collateralToken.liquidityBonus)
        .div(PERCENTAGE_FACTOR)
        .div(collateralPrice.rate.mul(debtTokenUnit))

      if (maxAmountCollateralToLiquidate.gt(collateralToken.totalCollateral)) {
        return {
          maxAmountCollateralToLiquidate: collateralToken.totalCollateral,
          maxAmountCollateralToLiquidateInDollars:
            collateralToken.totalCollateral
              .mul(collateralPrice.rate)
              .div(collateralTokenUnit),
        }
      } else {
        return {
          maxAmountCollateralToLiquidate: maxAmountCollateralToLiquidate,
          maxAmountCollateralToLiquidateInDollars:
            maxAmountCollateralToLiquidate
              .mul(collateralPrice.rate)
              .div(collateralTokenUnit),
        }
      }
    }

    return {
      maxAmountCollateralToLiquidate: BigNumber.from(0),
      maxAmountCollateralToLiquidateInDollars: BigNumber.from(0),
    }
  }

  public calculateBalanceWithEarnings(
    tokenBalance: BigNumber,
    liquidityIndex: BigNumber,
    rate: BigNumber,
    lastAssetActionTimestamp: BigNumber,
  ): BigNumber {
    const linearInterest = this.calculateLinearInterest(
      rate,
      lastAssetActionTimestamp,
    )
    const normalizeIncome = this.rayMul(linearInterest, liquidityIndex)

    return this.rayMul(tokenBalance, normalizeIncome)
  }

  public calculateBorrow(
    variableDebtTokens: VariableDebtTokenAsset[],
    stableDebtTokens: StableDebtTokenAsset[],
    reserves: Reserve[],
    prices: Price[],
  ): { totalBorrow: BigNumber; borrowedTokens: DebtReserve[] } {
    const borrowedTokens: DebtReserve[] = []
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
        ? this.calculateVariableDebt(
            balance.balance,
            reserve.variableBorrowRate,
            reserve.variableBorrowIndex,
            reserve.lastUpdateTimestamp,
          )
        : this.calculateStableDebt(
            balance.balance,
            reserve.stableBorrowRate,
            reserve.lastUpdateTimestamp,
          )

      const symbol = reserve.symbol.split('.')[0]
      const price = prices.find((price) => price.symbol === symbol)
      if (!price) {
        this.logger.error(`No price found for token ${reserve.symbol}`)
        return data
      }
      const tokenUnit = BigNumber.from(10).pow(reserve.decimals)
      const borrowAmount = value.mul(price.rate).div(tokenUnit)

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
    return { totalBorrow, borrowedTokens }
  }

  public calculateStableDebt(
    tokenBalance: BigNumber,
    stableBorrowRate: BigNumber,
    lastUpdateTimestamp: BigNumber,
  ): BigNumber {
    const compoundedInterest = this.calculateCompoundedInterest(
      stableBorrowRate,
      lastUpdateTimestamp,
    )

    return this.rayMul(tokenBalance, compoundedInterest)
  }

  public calculateVariableDebt(
    tokenBalance: BigNumber,
    variableBorrowRate: BigNumber,
    variableBorrowIndex: BigNumber,
    lastUpdateTimestamp: BigNumber,
  ): BigNumber {
    const compoundedInterest = this.calculateCompoundedInterest(
      variableBorrowRate,
      lastUpdateTimestamp,
    )
    const cumulated = this.rayMul(compoundedInterest, variableBorrowIndex)

    return this.rayMul(tokenBalance, cumulated)
  }

  public calculateCurrentLiquidityThreshold(
    totalCollateral: BigNumber,
    depositAssets: ATokenAsset[],
    reserves: Reserve[],
    prices: Price[],
  ): BigNumber {
    const collateralDeposits = depositAssets.filter(
      (depositAsset) => depositAsset.isCollateral,
    )
    const liquidationThreshold = collateralDeposits.reduce(
      (totalLiquidationThreshold, deposit) => {
        const reserve = reserves.find(
          (reserve) => reserve.aTokenAddress === deposit.address,
        )
        const price = prices.find((price) => price.symbol === reserve?.symbol)

        if (!reserve || !price) return totalLiquidationThreshold

        const tokenUnit = BigNumber.from(10).pow(reserve.decimals)
        const tokenBalanceWithEarnings = this.calculateBalanceWithEarnings(
          BigNumber.from(deposit.scaledBalance),
          reserve.liquidityIndex,
          reserve.liquidityRate,
          reserve.lastUpdateTimestamp,
        )

        return totalLiquidationThreshold.add(
          price.rate
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

  public calculateHealthFactor(
    totalBorrow: BigNumber, // in WEI
    userTotalCollateral: BigNumber, // in WEI
    userCurrentLiquidationThreshold: BigNumber, // 4 decimals
  ): BigNumber {
    if (totalBorrow.gt(0)) {
      return userTotalCollateral
        .mul(userCurrentLiquidationThreshold)
        .mul(BigNumber.from(10).pow(HEALTH_FACTOR_DECIMAL))
        .div(totalBorrow)
        .div(BigNumber.from(10).pow(PERCENTAGE_DECIMAL))
    }

    return MAX_BIG_NUMBER
  }

  public rayMul(a: BigNumber, b: BigNumber): BigNumber {
    if (a.eq(0) || b.eq(0)) {
      return BigNumber.from(0)
    }

    return a.mul(b).add(HALF_RAY).div(RAY)
  }

  public calculateCompoundedInterest(
    rate: BigNumber,
    lastUpdateTimestamp: BigNumber,
  ): BigNumber {
    const currentTimeStamp = BigNumber.from(Date.now()).div(1000)

    const exp = currentTimeStamp.sub(lastUpdateTimestamp)

    if (exp.eq(0)) {
      return RAY
    }

    const expMinusOne = exp.sub(1)
    const expMinusTwo = exp.gt(2) ? exp.sub(2) : BigNumber.from(0)

    const ratePerSecond = rate.div(SECONDS_PER_YEAR)

    const basePowerTwo = this.rayMul(ratePerSecond, ratePerSecond)
    const basePowerThree = this.rayMul(basePowerTwo, ratePerSecond)

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

  public calculateLinearInterest(
    rate: BigNumber,
    lastAssetActionTimestamp: BigNumber,
  ): BigNumber {
    const currentTimeStamp = BigNumber.from(Date.now()).div(1000)
    const timeDifference = currentTimeStamp.sub(lastAssetActionTimestamp)

    return rate.mul(timeDifference).div(SECONDS_PER_YEAR).add(RAY)
  }
}
