import { KaiToken } from './kaiToken'
import { useReduxSelector } from '@store/store.utils'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { Network } from '@constants/Networks'
import { Amount, parseDecimals } from '../amount'
import { KlnTokenName } from './klnTokenName'
import { KlnToken } from './klnToken'
import { KlnTokenSymbol } from './klnTokenSymbol'
import { balancesSelectors } from '@store/balances/balances.selector'

export class KlnTokens {
  async getKaiToken(): Promise<KaiToken> {
    const token = this.findKhalaniToken(KaiToken.KAI)
    if (token.name !== KaiToken.KAI || token.symbol !== KaiToken.KAI) {
      throw new Error(`Invalid ${KaiToken.KAI} token`)
    }
    return new KaiToken(
      token.name,
      token.symbol,
      token.address,
      parseDecimals(token.decimals),
    )
  }

  async getKlnToken(klnTokenName: KlnTokenName): Promise<KlnToken> {
    const token = this.findKhalaniToken(klnTokenName)
    if (token.name !== klnTokenName || token.symbol !== klnTokenName) {
      throw new Error(`Invalid ${klnTokenName} token`)
    }
    const klnTokenSymbol: KlnTokenSymbol = klnTokenName as any as KlnTokenSymbol
    const balance = useReduxSelector(balancesSelectors.selectById)(token.id)

    if (!balance) throw new Error('Balance not found')

    const klnToken = new KlnToken(
      token.id,
      klnTokenName,
      klnTokenSymbol,
      token.address,
      parseDecimals(token.decimals),
    )

    if (balance) {
      klnToken.updateBalance(
        Amount.fromBaseUnits(balance.balance, klnToken.decimals),
      )
    }

    return klnToken
  }

  private findKhalaniToken(klnTokenName: KlnTokenName | typeof KaiToken.KAI) {
    const khalaniNetworkTokens = useReduxSelector(
      tokenSelectors.selectByNetwork,
    )(Network.Khalani)
    return khalaniNetworkTokens.find((token) => token.name === klnTokenName)!
  }
}
