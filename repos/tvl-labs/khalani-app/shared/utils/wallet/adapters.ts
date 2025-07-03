import { useMemo } from 'react'

import {
  BrowserProvider,
  FallbackProvider,
  JsonRpcProvider,
  JsonRpcSigner,
} from 'ethers-v6'
import { HttpTransport, PublicClient, WalletClient } from 'viem'
import { useWalletClient } from 'wagmi'
import { Chain } from 'wagmi/chains'

import { Web3Provider } from '@ethersproject/providers'

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  if (!chain) return
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<HttpTransport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network),
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }

  return new JsonRpcProvider(transport.url, network)
}

export function walletClientToSigner(walletClient: WalletClient, chain: Chain) {
  const { account, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const provider = new BrowserProvider(transport as any, network)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const web3Provider = new Web3Provider(transport as any, network)

  if (!account) return
  const signer = new JsonRpcSigner(provider, account.address)
  const signerv5 = web3Provider.getSigner(account.address)
  return { signer, signerv5 }
}

export function useEthersSigner(chainId: number) {
  const { data: walletClient } = useWalletClient({
    chainId,
  })

  return useMemo(() => {
    if (!walletClient) return undefined

    const chain = { id: chainId, name: '' }
    return walletClientToSigner(walletClient, chain as Chain)
  }, [walletClient, chainId])
}
