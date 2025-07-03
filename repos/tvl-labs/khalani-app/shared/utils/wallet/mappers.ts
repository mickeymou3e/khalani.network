import { Chain } from 'wagmi/chains'

import { IChain } from '@tvl-labs/sdk'

export const mapToWagmiChain = (chain: IChain): Chain => ({
  id: chain.id,
  name: chain.chainName,
  nativeCurrency: chain.nativeCurrency,
  rpcUrls: {
    default: {
      http: chain.rpcUrls,
    },
    public: {
      http: chain.rpcUrls,
    },
  },
  blockExplorers: {
    default: { name: chain.chainName, url: chain.blockExplorerUrls[0] },
  },
})

export const mapWagmiChainRpcUrl = (
  wagmiChains: Chain[],
  supportedChains: IChain[],
): [Chain, ...Chain[]] => {
  if (wagmiChains.length === 0) {
    throw new Error('At least one chain must be provided')
  }

  const updatedChains = wagmiChains.map((wagmiChain) => {
    const foundRpcUrl = supportedChains.find((ch) => ch.id === wagmiChain.id)
      ?.rpcUrls

    return {
      ...wagmiChain,
      rpcUrls: {
        default: {
          http: foundRpcUrl ?? wagmiChain.rpcUrls.default.http,
        },
        public: {
          http: foundRpcUrl ?? wagmiChain.rpcUrls.public.http,
        },
      },
    }
  })

  return [updatedChains[0], ...updatedChains.slice(1)] as [Chain, ...Chain[]]
}
