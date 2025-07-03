import { BigNumber } from 'ethers'
import { call, put, select } from 'typed-redux-saga'

import { IReserve } from '@interfaces/tokens'
import { reservesActions } from '@store/reserves/reserves.slice'

import { convertSymbolToDisplayValue } from '../../utils/token'
import { contractsSelectors } from '../provider/provider.selector'

export function* initializeReservesSagaRpcCall(): Generator {
  try {
    const addressProviderContract = yield* select(
      contractsSelectors.addressProvider,
    )

    const addressProviderAddress = addressProviderContract?.address
    const uiHelperContract = yield* select(contractsSelectors.uiHelper)
    const reserves: IReserve[] = []

    if (uiHelperContract && addressProviderAddress) {
      const reservesFromRpcCall = yield* call(
        uiHelperContract.getReservesData,
        addressProviderAddress,
      )

      reservesFromRpcCall
        .filter((reserve) => reserve.isActive)
        .forEach((tok) => {
          const symbol = convertSymbolToDisplayValue(
            tok.symbol,
            undefined,
            tok.underlyingAsset,
          )

          reserves.push({
            id: tok.underlyingAsset.toLowerCase(),
            symbol: symbol,
            displayName: tok.symbol,
            address: tok.underlyingAsset.toLowerCase(),
            aTokenAddress: tok.aTokenAddress.toLowerCase(),
            stableDebtTokenAddress: tok.stableDebtTokenAddress.toLowerCase(),
            variableDebtTokenAddress: tok.variableDebtTokenAddress.toLowerCase(),
            decimals: tok.decimals.toNumber(),
            liquidityThreshold: tok.reserveLiquidationThreshold,
            isActive: tok.isActive,
            isFrozen: tok.isFrozen,
            liquidityRate: tok.liquidityRate,
            liquidityBonus: tok.reserveLiquidationBonus.toNumber(),
            isStableBorrowingEnable: tok.stableBorrowRateEnabled,
            ltv: tok.baseLTVasCollateral,
            isBorrowingEnable: tok.borrowingEnabled,
            stableBorrowRate: tok.stableBorrowRate,
            liquidityIndex: tok.liquidityIndex,
            variableBorrowIndex: tok.variableBorrowIndex,
            variableBorrowRate: tok.variableBorrowRate,
            interestRateStrategyAddress: tok.interestRateStrategyAddress,
            lastUpdateTimestamp: BigNumber.from(tok.lastUpdateTimestamp),
            totalVariableDebt: tok.totalScaledVariableDebt,
            totalStableDebt: tok.totalPrincipalStableDebt,
            availableLiquidity: tok.availableLiquidity,
            borrowCap: tok.borrowCap,
            depositCap: tok.depositCap,
          })
        })
    }

    yield* put(reservesActions.fetchReservesSuccess(reserves))
  } catch (error) {
    yield* put(reservesActions.fetchReservesFailure())
    console.error(error)
  }
}
