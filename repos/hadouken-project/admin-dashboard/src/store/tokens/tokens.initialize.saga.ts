import { BigNumber } from 'ethers'
import { call, put, select } from 'typed-redux-saga'

import { READ_ONLY_GAS_PRICE } from '@constants/Godwoken'
import { IReserve } from '@graph/pools/types'
import { fetchApplicationTokens } from '@graph/tokens'
import { TokenModel } from '@interfaces/tokens'
import { contractsSelectors } from '@store/provider/provider.selector'
import { reservesActions } from '@store/reserves/reserves.slice'
import { convertSymbolToDisplayValue } from '@utils/token'

import { tokensActions } from './tokens.slice'

export function* initializeTokensSaga(): Generator {
  try {
    const applicationTokens = yield* call(fetchApplicationTokens)

    const tokens: TokenModel[] = applicationTokens.map((token) => ({
      id: token.address,
      address: token.address,
      decimals: Number(token.decimals),
      name: token.symbol,
      symbol: convertSymbolToDisplayValue(token.symbol, token.address),

      isAToken: token.isAToken,
      isStableDebt: token.isStableDebt,
      isVariableDebt: token.isVariableDebt,
    }))

    yield* put(tokensActions.fetchApplicationsTokensSuccess(tokens))
  } catch (error) {
    yield* put(tokensActions.fetchApplicationsTokensFailure())
    console.error(error)
  }
}

export function* initializeTokensSagaRpcCall(): Generator {
  try {
    const addressProviderContract = yield* select(
      contractsSelectors.addressProvider,
    )

    const addressProviderAddress = addressProviderContract?.address
    const uiHelperContract = yield* select(contractsSelectors.uiHelper)
    const tokens: TokenModel[] = []

    if (uiHelperContract && addressProviderAddress) {
      const reservesFromRpcCall = yield* call(
        uiHelperContract.getReservesData,
        addressProviderAddress,
        {
          gasPrice: READ_ONLY_GAS_PRICE,
        },
      )

      reservesFromRpcCall
        .filter((reserve) => reserve.isActive)
        .forEach((tok) => {
          const symbol = convertSymbolToDisplayValue(
            tok.symbol,
            tok.underlyingAsset,
          )

          tokens.push({
            id: tok.underlyingAsset.toLowerCase(),
            address: tok.underlyingAsset.toLowerCase(),
            decimals: tok.decimals.toNumber(),
            name: symbol,
            symbol: symbol,
            isAToken: false,
            isStableDebt: false,
            isVariableDebt: false,
          })

          tokens.push({
            id: tok.aTokenAddress.toLowerCase(),
            address: tok.aTokenAddress.toLowerCase(),
            decimals: tok.decimals.toNumber(),
            name: `h${symbol}`,
            symbol: `h${symbol}`,
            isAToken: true,
            isStableDebt: false,
            isVariableDebt: false,
          })

          tokens.push({
            id: tok.stableDebtTokenAddress.toLowerCase(),
            address: tok.stableDebtTokenAddress.toLowerCase(),
            decimals: tok.decimals.toNumber(),
            name: `hs${symbol}`,
            symbol: `hs${symbol}`,
            isAToken: false,
            isStableDebt: true,
            isVariableDebt: false,
          })

          tokens.push({
            id: tok.variableDebtTokenAddress.toLowerCase(),
            address: tok.variableDebtTokenAddress.toLowerCase(),
            decimals: tok.decimals.toNumber(),
            name: `hv${symbol}`,
            symbol: `hv${symbol}`,
            isAToken: false,
            isStableDebt: false,
            isVariableDebt: true,
          })
        })
    }

    yield* put(tokensActions.fetchApplicationsTokensSuccess(tokens))
  } catch (error) {
    yield* put(tokensActions.fetchApplicationsTokensFailure())
    console.error(error)
  }
}

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
        {
          gasPrice: READ_ONLY_GAS_PRICE,
        },
      )

      reservesFromRpcCall
        .filter((reserve) => reserve.isActive)
        .forEach((tok) => {
          const symbol = convertSymbolToDisplayValue(
            tok.symbol,
            tok.underlyingAsset,
          )

          reserves.push({
            id: tok.underlyingAsset.toLowerCase(),
            symbol: symbol,
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
