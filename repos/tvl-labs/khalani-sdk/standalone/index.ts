// StandaloneSDK.ts
import { BalanceService } from './services/BalanceService'
import { ContractService } from './services/ContractService'
import { IntentService } from './services/IntentService'
import { DepositService } from './services/DepositService'
import { RefineService } from './services/RefineService'
import { WalletService } from './services/WalletService'
import { WalletState } from './types'
import { TokensService } from './services/TokensService'
import { WithdrawService } from './services/WithdrawService'
import { loadConfig, NetworkType } from './config'
import ConfigSchema from './config/config.schema.json'
export class ArcadiaSDK {
  public walletService: WalletService
  public contractService: ContractService
  public intentService: IntentService
  public refineService: RefineService
  public balanceService: BalanceService
  public depositService: DepositService
  public tokensService: TokensService
  public config: typeof ConfigSchema
  public withdrawService: WithdrawService
  constructor(providerType: 'EthersV5', networkType: NetworkType) {
    const config = loadConfig(networkType)
    this.config = config
    this.walletService = new WalletService(config, networkType)
    this.tokensService = new TokensService(this.walletService, config)
    this.contractService = new ContractService(
      config,
      this.walletService,
      this.tokensService,
    )
    this.intentService = new IntentService(
      config,
      networkType,
      this.walletService,
      this.contractService,
    )
    this.refineService = new RefineService(config, this.tokensService)
    this.balanceService = new BalanceService(
      this.contractService,
      this.tokensService,
    )
    this.depositService = new DepositService(
      this.contractService,
      this.walletService,
    )
    this.withdrawService = new WithdrawService(config, this.walletService)
  }

  /**
   * Updates all the dependent services with the current wallet state.
   */
  public updateDependencies(walletState: WalletState): void {
    const { provider, signer, userAddress, network } = walletState
    if (!provider || !signer || !userAddress || !network) {
      throw new Error(
        'Incomplete wallet state. Provider, signer, userAddress, or network is missing.',
      )
    }

    // Update WalletService.
    this.walletService.updateProvider(provider)
    this.walletService.updateSigner(signer)
    this.walletService.updateNetworkAndAddress(userAddress, network)
  }

  public get wallet(): WalletService {
    return this.walletService
  }

  public get intent(): IntentService {
    return this.intentService
  }

  public get refine(): RefineService {
    return this.refineService
  }

  public get contract(): ContractService {
    return this.contractService
  }

  public get balance(): BalanceService {
    return this.balanceService
  }

  public get deposit(): DepositService {
    return this.depositService
  }

  public get tokens(): TokensService {
    return this.tokensService
  }
}

export { NetworkType }
