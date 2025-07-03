import { ethers } from 'ethers'
import { StrictEffect } from 'redux-saga/effects'
import { call, put, select } from 'typed-redux-saga'

import { IBackstopPool } from '@interfaces/data'
import { contractsSelectors } from '@store/provider/provider.selector'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { convertSymbolToDisplayValue } from '@utils/token'

import { backstopActions } from '../backstop.slice'

// fetch standard tokens with variable/stable debt + deposit
export function* fetchBackstopPools(): Generator<StrictEffect, void> {
  try {
    const tokens = yield* select(tokenSelectors.selectAll)
    const addressProvider = yield* select(contractsSelectors.addressProvider)
    const addressProviderAddress = addressProvider?.address
    const uiHelper = yield* select(contractsSelectors.uiHelper)
    const walletAddress =
      (yield* select(walletSelectors.ethAddress)) ??
      ethers.constants.AddressZero

    if (addressProviderAddress && uiHelper) {
      const response = yield* call(
        uiHelper?.callStatic.getBackstopPools,
        addressProviderAddress,
        walletAddress,
      )

      const data: IBackstopPool[] = []

      for (const item of response) {
        if (item.tokenAddress !== ethers.constants.AddressZero) {
          const token = tokens.find(
            (x) => x.address.toLowerCase() === item.tokenAddress.toLowerCase(),
          )

          data.push({
            id: item.tokenAddress.toLowerCase(),
            address: item.tokenAddress.toLowerCase(),
            symbol: convertSymbolToDisplayValue(
              item.symbol,
              undefined,
              item.tokenAddress.toLowerCase(),
            ),
            decimals: token?.decimals ?? 0,
            totalBalance: item.totalBalance,
            userBalance: item.userBalance,
          })
        }
      }

      yield* put(backstopActions.fetchBackstopPoolsSuccess(data))
    } else {
      throw Error('address provider or ui helper not defined')
    }
  } catch (e) {
    console.error('error', e)
    yield* put(backstopActions.fetchBackstopPoolsFailure())
  }
}
