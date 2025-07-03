import { call, put } from 'typed-redux-saga'

import { PayloadAction } from '@reduxjs/toolkit'
import { providerActions } from '@tvl-labs/sdk'
import { ProviderSliceState } from '@tvl-labs/sdk/dist/app/src/store/provider/provider.types'

import { updateLatestBlock } from './updateLatestBlock.saga'

export function* updateSdkWalletSaga(
  action: PayloadAction<ProviderSliceState>,
): Generator {
  yield* put(providerActions.update(action.payload))
  yield* call(updateLatestBlock)
}
