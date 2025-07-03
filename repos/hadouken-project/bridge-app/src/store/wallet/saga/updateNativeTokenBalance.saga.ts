import { apply, put, select } from 'typed-redux-saga'

import { providerSelectors } from '@store/provider/provider.selectors'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'

export function* updateNativeTokenBalance(): Generator {
  const provider = yield* select(providerSelectors.provider)
  const ethAddress = yield* select(walletSelectors.ethAddress)

  try {
    const nativeTokenBalance = yield* apply(provider, provider.getBalance, [
      ethAddress,
    ])

    yield* put(walletActions.setUserNativeTokenBalance(nativeTokenBalance))
  } catch (error) {
    console.error(error)
  }
}
