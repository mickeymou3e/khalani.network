import { UsdTokenName } from './usdToken/usdTokenName'
import { UsdToken } from './usdToken/usdToken'
import { tokenSelectors } from '@store/tokens/tokens.selector'
import { balancesSelectors } from '@store/balances/balances.selector'
import { stringToUsdTokenSymbol } from './usdToken/usdTokenSymbol'
import { Amount, parseDecimals } from './amount'
import { Sdk } from './sdk'
import { updateCurrentChainBalancesSaga } from '@store/balances/saga/updateCurrentChainBalancesSaga.saga'
import { runSaga, useReduxSelector } from '@store/store.utils'
import { Network } from '@constants/Networks'
import { updateBalancesSaga } from '@store/balances/saga/updateBalancesSaga.saga'
import { TokenType } from '@store/tokens/tokens.types'
import { updateMTokenBalancesSaga } from '@store/mTokenBalances/balances.saga'
import { updateNativeBalancesSaga } from '@store/nativeBalances/saga/updateNativeBalancesSaga.saga'
import { updateIntentBalancesSaga } from '@store/intentBalances'

export class Tokens {
  constructor(private sdk: Sdk) {}

  async getTokenOnCurrentNetwork(
    name: UsdTokenName,
  ): Promise<UsdToken | undefined> {
    const network = this.sdk.wallet().getNetwork()
    if (!network) {
      throw new Error('No network is selected')
    }
    return await this.getTokenOnNetwork(name, network)
  }

  async getTokenOnNetwork(
    name: UsdTokenName,
    network: Network,
  ): Promise<UsdToken> {
    const selectTokensByNetwork = useReduxSelector(
      tokenSelectors.selectByNetwork,
    )
    const tokenModelBalanceWithChains = selectTokensByNetwork(network)
    const token = tokenModelBalanceWithChains.find(
      (t) => t.name.startsWith(name), // TODO[SDK]: come up with a better selector.
    )!
    const balance = useReduxSelector(balancesSelectors.selectById)(token.id)
    const tokenSymbol = stringToUsdTokenSymbol(token.symbol)
    if (!tokenSymbol) {
      throw new Error(`Unknown token symbol: ${token.symbol}`)
    }
    const usdToken = new UsdToken(
      name,
      network,
      token.address,
      parseDecimals(token.decimals),
      tokenSymbol,
    )
    if (balance) {
      usdToken.updateBalance(
        Amount.fromBaseUnits(balance.balance, usdToken.decimals),
      )
    }
    return usdToken
  }

  async getKlnToken(name: UsdTokenName): Promise<UsdToken> {
    const selectTokensByNetwork = useReduxSelector(
      tokenSelectors.selectByNetwork,
    )
    const tokenModelBalanceWithChains = selectTokensByNetwork(Network.Khalani)

    const foundToken = tokenModelBalanceWithChains.find(
      (token) => token.symbol.includes(name) && token.type === TokenType.KLN,
    )
    if (!foundToken) {
      throw new Error(`${foundToken} not found`)
    }
    const tokenSymbol = stringToUsdTokenSymbol(foundToken.symbol)
    if (!tokenSymbol) {
      throw new Error(`Unknown token symbol: ${foundToken.symbol}`)
    }
    const balance = useReduxSelector(balancesSelectors.selectById)(
      foundToken.id,
    )
    const usdToken = new UsdToken(
      name,
      Network.Khalani,
      foundToken.address,
      parseDecimals(foundToken.decimals),
      tokenSymbol,
    )
    if (balance) {
      usdToken.updateBalance(
        Amount.fromBaseUnits(balance.balance, usdToken.decimals),
      )
    }
    return usdToken
  }

  async updateCurrentChainBalances() {
    await runSaga(updateCurrentChainBalancesSaga)
  }

  async updateRemoteChainBalances() {
    await runSaga(updateBalancesSaga)
  }

  async updateMTokenBalances() {
    await runSaga(updateMTokenBalancesSaga)
  }

  async updateIntentBalances() {
    await runSaga(updateIntentBalancesSaga)
  }

  async updateNativeBalances() {
    await runSaga(updateNativeBalancesSaga)
  }
}
