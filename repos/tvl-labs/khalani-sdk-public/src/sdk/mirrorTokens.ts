import { UsdToken } from './usdToken/usdToken'
import { MirrorToken } from './mirrorToken/mirrorToken'
import { useReduxSelector } from '@store/store.utils'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { Network } from '@constants/Networks'
import { TokenWithChainId } from '@store/tokens/tokens.types'
import { parseDecimals } from './amount'
import { stringToMirrorTokenName } from './mirrorToken/mirrorTokenName'
import { stringToMirrorTokenSymbol } from './mirrorToken/mirrorTokenSymbol'
import { mTokenBalancesSelectors } from '@store/mTokenBalances/balances.selector'
import { nativeBalancesSelectors } from '@store/nativeBalances/nativeBalances.selector'
import { intentBalancesSelectors } from '@store/intentBalances'

export class MirrorTokens {
  async getMirrorTokenOf(usdToken: UsdToken): Promise<MirrorToken> {
    const khalaniNetworkTokens = useReduxSelector(
      tokenSelectors.selectByNetwork,
    )(Network.Khalani)
    for (const khalaniNetworkToken of khalaniNetworkTokens) {
      if (
        // TODO: find a better way to map end chains' and mirror tokens.
        khalaniNetworkToken.name.startsWith(usdToken.name) &&
        usdToken.network ===
          (khalaniNetworkToken as TokenWithChainId)?.sourceChainId
      ) {
        const mirrorTokenName = stringToMirrorTokenName(
          khalaniNetworkToken.name,
        )
        const mirrorTokenSymbol = stringToMirrorTokenSymbol(
          khalaniNetworkToken.symbol,
        )
        if (!mirrorTokenName || !mirrorTokenSymbol) {
          throw new Error(
            `Unknown name or symbol ${khalaniNetworkToken.name} ${khalaniNetworkToken.symbol}`,
          )
        }
        return new MirrorToken(
          usdToken,
          khalaniNetworkToken.address,
          mirrorTokenName,
          mirrorTokenSymbol,
          parseDecimals(khalaniNetworkToken.decimals),
        )
      }
    }
    throw new Error(`No mirror token found for ${usdToken}`)
  }

  async getMTokensBalances(): Promise<any> {
    const mTokenBalances = useReduxSelector(mTokenBalancesSelectors.selectAll)

    return mTokenBalances
  }

  async getIntentBalances(): Promise<any> {
    const intentBalances = useReduxSelector(intentBalancesSelectors.selectAll)

    return intentBalances
  }

  async getNativeBalances(): Promise<any> {
    const mTokenBalances = useReduxSelector(nativeBalancesSelectors.selectAll)

    return mTokenBalances
  }
}
