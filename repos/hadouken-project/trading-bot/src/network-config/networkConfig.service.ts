import { Injectable, Logger } from '@nestjs/common'
import { networks } from '@config/networks.json'

@Injectable()
export class NetworkConfigService {
  private readonly logger = new Logger(NetworkConfigService.name)
  public getChainData(chainId: string) {
    const chainData = networks.find((chain) => chain.chainId === chainId)
    if (!chainData) {
      const errorMsg = `Chain ID ${chainId} is not supported`
      this.logger.error(errorMsg)
      throw errorMsg
    }

    return chainData
  }
}
