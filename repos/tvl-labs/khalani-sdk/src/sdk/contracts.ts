import config from '@config'
import { evmChainContractsSelectors } from '@store/contracts/contracts.selectors'
import { useReduxSelector } from '@store/store.utils'

export class Contracts {
  async getCurrentNetworkAssetReservesAddress(): Promise<string | undefined> {
    const address = useReduxSelector(
      evmChainContractsSelectors.assetReservesAddress,
    )
    return address ? address : undefined
  }

  async getInterchainLiquidityHubAddress(): Promise<string | undefined> {
    const address = config.contracts.InterchainLiquidityHub
    return address ? address : undefined
  }

  async getPermit2Address(): Promise<string | undefined> {
    const address = useReduxSelector(evmChainContractsSelectors.permit2Address)
    return address ? address : undefined
  }
}
