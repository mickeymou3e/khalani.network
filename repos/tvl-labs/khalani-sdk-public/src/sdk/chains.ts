import { useReduxSelector } from '@store/store.utils'
import { Network } from '@constants/Networks'
import { chainsSelectors } from '@store/chains/chains.selector'

export class Chains {
  constructor() {}

  async getChains() {
    return useReduxSelector(chainsSelectors.chains)
  }

  async getChainById(network: Network) {
    const selectById = useReduxSelector(chainsSelectors.selectById)
    const chain = selectById(network);
    if (!chain) {
      throw new Error(`No chain found for ${network}`);
    }
    return chain;
  }

  async getRpcUrl(network: Network): Promise<string> {
    const chain = await this.getChainById(network);
    return chain.rpcUrls[0];
  }
}
