import { put, call } from 'typed-redux-saga'

import { fetchApplicationTokens } from '@graph/tokens'
import { TokenModel } from '@interfaces/tokens'

import { tokensActions } from '../tokens.slice'

export function* fetchApplicationTokensSaga(): Generator {
  try {
    const applicationTokens = yield* call(fetchApplicationTokens)

    const tokens: TokenModel[] = applicationTokens.map((token) => ({
      id: token.address,
      address: token.address,
      decimals: Number(token.decimals),
      name: token.symbol,
      symbol: token.symbol,
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
