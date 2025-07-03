import { apply, put, select } from 'typed-redux-saga'

import { providerSelector } from '@store/provider/provider.selector'
import { walletSelectors } from '@store/wallet/wallet.selector'
import { walletActions } from '@store/wallet/wallet.slice'

export function* updateNativeTokenBalance(): Generator {
  const provider = yield* select(providerSelector.provider)
  const userAddress = yield* select(walletSelectors.userAddress)

  if (provider && userAddress) {
    try {
      const nativeTokenBalance = yield* apply(provider, provider.getBalance, [
        userAddress,
      ])

      yield* put(walletActions.setUserNativeTokenBalance(nativeTokenBalance))
    } catch (error) {
      console.error(error)
    }
  }
}
