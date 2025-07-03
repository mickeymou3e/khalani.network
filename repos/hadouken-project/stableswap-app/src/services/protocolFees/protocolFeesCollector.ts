import { Web3Provider } from '@ethersproject/providers'
import {
  Vault,
  ProtocolFeesCollector__factory,
  ProtocolFeesCollector as IProtocolFeesCollector,
} from '@hadouken-project/typechain'
import { BigDecimal } from '@utils/math'

export class ProtocolFeesCollector {
  private _protocolFeesCollector: IProtocolFeesCollector | undefined

  constructor(
    public readonly vault: Vault | null,
    public readonly provider: Web3Provider | null,
  ) {}

  public async getProtocolFeePercentage(): Promise<BigDecimal> {
    try {
      const protocolFeesCollector = await this._getProtocolFeesCollector()

      if (protocolFeesCollector) {
        const swapFeePercentage = await protocolFeesCollector.getSwapFeePercentage()

        return BigDecimal.from(swapFeePercentage)
      }

      return BigDecimal.from(0)
    } catch {
      return BigDecimal.from(0)
    }
  }

  private async _getProtocolFeesCollector() {
    if (this._protocolFeesCollector) {
      return this._protocolFeesCollector
    }

    if (this.provider && this.vault) {
      const protocolFeesCollectorAddress = await this.vault.getProtocolFeesCollector()

      const protocolFeesCollector = ProtocolFeesCollector__factory.connect(
        protocolFeesCollectorAddress,
        this.provider.getSigner(),
      )

      this._protocolFeesCollector = protocolFeesCollector

      return protocolFeesCollector
    }
  }
}
