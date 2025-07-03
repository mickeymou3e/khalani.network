/* eslint-disable */
import { StrictEffect } from 'redux-saga/effects'
import { select } from 'typed-redux-saga'

import { contractsSelectors } from '@store/provider/provider.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'

export function* fetchUserNativeBalance(
  userAddress: string,
): Generator<StrictEffect> {
  const provider = yield* select(contractsSelectors.provider)
  const nativeToken = yield* select(tokenSelectors.getNativeToken)

  // TODO bring before mainNet launch
  // const userBalance = yield* apply(provider, provider.getBalance, [userAddress])

  // if (nativeToken) {
  //   yield* put(
  //     balancesActions.updateBalancesSuccess({
  //       id: userAddress,
  //       balances: {
  //         [nativeToken.address]: {
  //           value: userBalance,
  //           isFetching: false,
  //           symbol: nativeToken.symbol,
  //           decimals: 8,
  //         },
  //       },
  //     }),
  //   )
  // }
}
