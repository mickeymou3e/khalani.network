import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useWalletClient,
} from 'wagmi'
import { mainnet, Chain, sepolia } from 'wagmi/chains'

import {
  getNetworkById,
  getNetworkIdNumber,
  mapToWagmiChain,
} from '@shared/utils'
import { WalletType } from '@tvl-labs/khalani-ui'
import { chainsSelectors, Network } from '@tvl-labs/sdk'

import { networkType } from '../../config'

type WalletUnavailable = {
  account: null
  network: null
  status: 'unavailable'
}

type WalletNotConnected = {
  account: null
  network: null
  status: 'notConnected'
  connect: (targetNetworkId?: Network, walletType?: WalletType) => void
}

type WalletConnecting = {
  account: null
  network: null
  status: 'connecting'
}

type WalletUnsupportedNetwork = {
  account: string
  network: null
  status: 'unsupportedNetwork'
  unsupportedNetworkId: string
  switchToNetwork: (targetNetwork: Network) => void
}

type WalletIdle = {
  account: null
  network: null
  status: 'idle'
  connect: (targetNetworkId?: Network, walletType?: WalletType) => void
}

type WalletConnected = {
  account: string
  network: Network
  status: 'connected'
  nativeTokenBalance: bigint | null
  switchToNetwork: (targetNetwork: Network) => void
  disconnect: () => void
}

export type WalletState =
  | WalletUnavailable
  | WalletNotConnected
  | WalletConnecting
  | WalletUnsupportedNetwork
  | WalletConnected
  | WalletIdle

export function useWallet(): WalletState {
  const { isConnected, address } = useAccount()
  const { isError, error, connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()

  const { data: balance } = useBalance({
    address,
  })
  const { isLoading } = useWalletClient()

  const { chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()

  const network = useMemo(() => {
    return chainId ? getNetworkById(chainId) : null
  }, [chainId])

  const switchToNetwork = useCallback(
    async (targetNetwork: Network) => {
      const targetChainId = getNetworkIdNumber(targetNetwork)
      if (chainId !== targetChainId) {
        try {
          await switchChainAsync?.({ chainId: targetChainId })
        } catch (e) {
          console.error(
            `Failed to switch Wallet network to ${targetNetwork}`,
            e,
          )
        }
      }
    },
    [chainId, switchChainAsync],
  )

  const connect = useCallback(
    async (targetNetwork?: Network, walletType?: WalletType) => {
      const foundConnector = connectors.find(
        (connector) =>
          connector.name.toLowerCase() === walletType?.toLowerCase(),
      )
      if (!foundConnector) return

      try {
        const result = await connectAsync({
          connector: foundConnector,
          chainId: targetNetwork
            ? getNetworkIdNumber(targetNetwork)
            : undefined,
        })

        if (
          targetNetwork &&
          result.chainId !== getNetworkIdNumber(targetNetwork)
        ) {
          await switchToNetwork(targetNetwork)
        }
      } catch (e) {
        console.error('Failed to connect wallet', e)
      }
    },
    [connectAsync, connectors, switchToNetwork],
  )

  const disconnect = useCallback(async () => {
    try {
      await disconnectAsync()
    } catch (e) {
      console.error('Failed to disconnect wallet', e)
    }
  }, [disconnectAsync])

  useEffect(() => {
    if (isError) {
      console.error('Wallet is in unavailable status', error)
    }
  }, [isError, error])

  if (isLoading) {
    return {
      status: 'connecting',
      account: null,
      network: null,
    }
  }
  if (isConnected && network) {
    return {
      status: 'connected',
      account: address as string,
      network,
      nativeTokenBalance: balance ? balance.value : null,
      switchToNetwork,
      disconnect,
    }
  }
  if (!isConnected) {
    return {
      status: 'notConnected',
      account: null,
      network: null,
      connect,
    }
  }
  return {
    status: 'unsupportedNetwork',
    account: address as string,
    network: null,
    unsupportedNetworkId: chainId?.toString() ?? 'unknown',
    switchToNetwork,
  }
}

export const useWagmiChains = (): [Chain, ...Chain[]] => {
  const supportedChains = useSelector(chainsSelectors.chains)

  const defaultChain = useMemo(() => {
    if (networkType === 'testnet') {
      return sepolia
    }
    return mainnet
  }, [networkType])

  const additionalChains = useMemo(
    () => supportedChains.map(mapToWagmiChain) as [Chain, ...Chain[]],
    [supportedChains],
  )

  return useMemo(() => {
    return additionalChains.length > 0
      ? (additionalChains as [Chain, ...Chain[]])
      : [defaultChain]
  }, [additionalChains, supportedChains, defaultChain])
}
