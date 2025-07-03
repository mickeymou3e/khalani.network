import { Web3Provider } from '@ethersproject/providers'
import { Vault } from '@hadouken-project/swap-contracts-v2'
import {
  ProtocolFeesCollector__factory,
  ProtocolFeesCollector as IProtocolFeesCollector,
} from '@hadouken-project/swap-contracts-v2/dist/contracts'
import { BigDecimal } from '@utils/math'

export class ProtocolFeesCollector {
  private _protocolFeesCollector: IProtocolFeesCollector | undefined
  constructor(
    public readonly vault: Vault | null,
    public readonly provider: Web3Provider | null,
  ) {}

  public async getProtocolFeePercentage(): Promise<BigDecimal> {
    const protocolFeesCollector = await this._getProtocolFeesCollector()

    if (protocolFeesCollector) {
      const swapFeePercentage = await protocolFeesCollector.getSwapFeePercentage()

      return BigDecimal.from(swapFeePercentage)
    }

    return BigDecimal.from(0)
  }

  private async _getProtocolFeesCollectorAddress(): Promise<
    string | undefined
  > {
    if (this.vault) {
      const address = await this.vault.getProtocolFeesCollector()

      return address
    }
  }

  private async _getProtocolFeesCollector() {
    if (this._protocolFeesCollector) {
      return this._protocolFeesCollector
    }

    const protocolFeesCollectorAddress = await this._getProtocolFeesCollectorAddress()

    if (protocolFeesCollectorAddress && this.provider) {
      const protocolFeesCollector = new ProtocolFeesCollector__factory(
        this.provider.getSigner(),
      ).attach(protocolFeesCollectorAddress)

      this._protocolFeesCollector = protocolFeesCollector

      return protocolFeesCollector
    }
  }
}
