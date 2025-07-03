import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'

import { FallbackProvider, JsonRpcProvider, JsonRpcSigner } from 'ethers-v6'
import { PublicClient } from 'viem'
import {
  useAccount,
  useWalletClient,
  createConfig,
  usePublicClient,
  http,
  useChainId,
  createStorage,
  Config,
  WagmiProvider,
} from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

import config from '@config'
import {
  JsonRpcSigner as JsonRpcSignerv5,
  Web3Provider,
} from '@ethersproject/providers'
import { getNetworkById } from '@shared/utils'
import { StoreDispatch } from '@store/store.types'
import { providerActions } from '@tvl-labs/sdk'

import { useWagmiChains, walletActions } from '../store'
import { publicClientToProvider, walletClientToSigner } from '../utils'

interface IContext {
  web3Provider?: Web3Provider
  projectId: string
}

export const WalletContext = createContext<IContext>({} as IContext)

export const WalletContextProvider = ({
  children,
  projectId,
}: {
  children: ReactNode | ReactNode[]
  projectId: string
}) => {
  const dispatch = useDispatch<StoreDispatch>()

  const [provider, setProvider] = useState<
    JsonRpcProvider | FallbackProvider | null
  >(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [signerv5, setSignerv5] = useState<JsonRpcSignerv5 | null>(null)

  const { data: walletClient } = useWalletClient()
  const { address: userAddress, chain } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()

  const value = useMemo(
    () => ({
      provider,
      signer,
      projectId,
    }),
    [provider, signer, projectId],
  )

  useEffect(() => {
    const jsonRpcProvider = publicClientToProvider(publicClient as PublicClient)
    if (!jsonRpcProvider) {
      console.error('No provider found')
      return
    }
    setProvider(jsonRpcProvider)
    dispatch(providerActions.updateProvider(jsonRpcProvider as JsonRpcProvider))
  }, [dispatch, publicClient])

  useEffect(() => {
    if (!walletClient || !chain) return
    const walletClientSigner = walletClientToSigner(walletClient, chain)
    if (!walletClientSigner) {
      console.error('No wallet client signer found')
      return
    }
    const { signer, signerv5 } = walletClientSigner
    setSignerv5(signerv5)
    setSigner(signer)
  }, [walletClient, chain])

  useEffect(() => {
    if (!provider || !signer || !chainId) return
    const network = getNetworkById(chainId)
    if (!network) return
    dispatch(
      walletActions.update({
        userAddress: userAddress as string | null,
        network,
        provider: provider as JsonRpcProvider,
        signer,
        signerv5,
      }),
    )
  }, [signer, signerv5, dispatch, provider, userAddress, chainId])

  return (
    <WalletContext.Provider
      value={{
        ...value,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWalletContext = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error(
      'useWalletConnectClient must be used within a ClientContextProvider',
    )
  }
  return context
}

export const WalletProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[]
}) => {
  const projectId = config.wcProjectId
  const chains = useWagmiChains()

  const wagmiConfig = useMemo<Config>(
    () =>
      createConfig({
        chains,
        transports: Object.fromEntries(
          chains.map((chain) => [chain.id, http()]),
        ),
        connectors: [
          walletConnect({
            projectId,
            showQrModal: true,
            metadata: {
              name: 'Khalani',
              description: 'Khalani',
              url: window.location.origin,
              icons: [window.location.origin + '/favicon.ico'],
            },
          }),
          injected({ target: 'metaMask' }),
        ],
        storage: createStorage({ storage: window.localStorage }),
      }),
    [chains, projectId],
  )

  return (
    <WagmiProvider config={wagmiConfig}>
      <WalletContextProvider projectId={projectId}>
        {children}
      </WalletContextProvider>
    </WagmiProvider>
  )
}
