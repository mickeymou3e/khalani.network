import { call, put, select } from 'typed-redux-saga'

import { TokenModel } from '@interfaces/tokens'
import { contractsSelectors } from '@store/provider/provider.selector'
import { convertSymbolToDisplayValue } from '@utils/token'

import { tokensActions } from './tokens.slice'

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
      )

      reservesFromRpcCall
        .filter((reserve) => reserve.isActive)
        .forEach((tok) => {
          const symbol = convertSymbolToDisplayValue(
            tok.symbol,
            undefined,
            tok.underlyingAsset,
          )

          tokens.push({
            id: tok.underlyingAsset.toLowerCase(),
            address: tok.underlyingAsset.toLowerCase(),
            decimals: tok.decimals.toNumber(),
            name: symbol,
            symbol: symbol,
            source: '',
            isAToken: false,
            isStableDebt: false,
            isVariableDebt: false,
            displayName: symbol,
          })

          tokens.push({
            id: tok.aTokenAddress.toLowerCase(),
            address: tok.aTokenAddress.toLowerCase(),
            decimals: tok.decimals.toNumber(),
            name: `h${symbol}`,
            symbol: `h${symbol}`,
            source: '',
            isAToken: true,
            isStableDebt: false,
            isVariableDebt: false,
            displayName: symbol,
          })

          tokens.push({
            id: tok.stableDebtTokenAddress.toLowerCase(),
            address: tok.stableDebtTokenAddress.toLowerCase(),
            decimals: tok.decimals.toNumber(),
            name: `hs${symbol}`,
            symbol: `hs${symbol}`,
            source: '',
            isAToken: false,
            isStableDebt: true,
            isVariableDebt: false,
            displayName: symbol,
          })

          tokens.push({
            id: tok.variableDebtTokenAddress.toLowerCase(),
            address: tok.variableDebtTokenAddress.toLowerCase(),
            decimals: tok.decimals.toNumber(),
            name: `hv${symbol}`,
            symbol: `hv${symbol}`,
            source: '',
            isAToken: false,
            isStableDebt: false,
            isVariableDebt: true,
            displayName: symbol,
          })
        })
    }
    yield* put(tokensActions.fetchApplicationsTokensSuccess(tokens))
  } catch (error) {
    yield* put(tokensActions.fetchApplicationsTokensFailure())
    console.error(error)
  }
}
