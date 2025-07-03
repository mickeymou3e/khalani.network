/* Godwoken V1 TEMP Stub */
import { providers } from 'ethers'
import { CallEffect, Effect } from 'redux-saga/effects'
import { apply, call, select } from 'typed-redux-saga'

import { MetamaskActions } from '@constants/Metamask'
import { Network } from '@constants/Networks'
import { IToken } from '@interfaces/token'
import detectEthereumProvider from '@metamask/detect-provider'
import { MetaMaskInpageProvider } from '@metamask/inpage-provider'
import { RequestArguments } from '@metamask/inpage-provider/dist/BaseProvider'
import { providerSelector } from '@store/provider/provider.selector'

export function* detectMetamask(): Generator<
  CallEffect,
  MetaMaskInpageProvider
> {
  const metamaskProvider: MetaMaskInpageProvider = (yield* call(
    detectEthereumProvider,
    { mustBeMetaMask: true },
  )) as MetaMaskInpageProvider

  return metamaskProvider
}

/**
 * 'any' which if specified means the Provider will allow the backend network to change, meaning the network is not immutable
 */
const ETHERS_ISSUE_866 = 'any'

export const getProvider = (): providers.JsonRpcProvider | null => {
  const metaMaskProvider = getMetaMaskProvider()

  if (metaMaskProvider) {
    const web3Provider = new providers.Web3Provider(
      metaMaskProvider as providers.ExternalProvider,
      ETHERS_ISSUE_866,
    )

    return web3Provider
  }

  return null
}

export const getMetaMaskProvider = (): MetaMaskInpageProvider =>
  window?.ethereum as MetaMaskInpageProvider

export function* connectMetamaskWallet(
  provider: providers.Web3Provider,
): Generator {
  yield* apply(provider, provider.send, [
    MetamaskActions.requestWallet,
    [{ eth_accounts: {} }],
  ])
}

export function* switchNetwork(
  networkId: Network | null,
  provider: providers.Web3Provider | null,
): Generator {
  if (!provider) {
    return
  }
  yield* apply(provider, provider.send, [
    MetamaskActions.switchNetwork,
    [{ chainId: networkId }],
  ])
}

export function* addNetworkToMetamaskWallet(
  networkConfig: {
    chainId: string
    chainName: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
  },
  provider: providers.Web3Provider | null,
): Generator {
  if (!provider) {
    return
  }
  yield* apply(provider, provider.send, [
    MetamaskActions.addNetwork,
    [
      {
        chainId: networkConfig.chainId,
        chainName: networkConfig.chainName,
        nativeCurrency: {
          name: networkConfig.nativeCurrency.name,
          symbol: networkConfig.nativeCurrency.symbol,
          decimals: networkConfig.nativeCurrency.decimals,
        },
        rpcUrls: networkConfig.rpcUrls,
        blockExplorerUrls: networkConfig.blockExplorerUrls,
      },
    ],
  ])
}

const METAMASK_ASSET_TYPE = 'ERC20'

export function* addTokenToMetaMask(
  ethereum: MetaMaskInpageProvider,
  token: IToken,
): Generator {
  yield* call(ethereum.request, {
    method: MetamaskActions.watchAsset,
    params: {
      type: METAMASK_ASSET_TYPE,
      options: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals.toString(),
      },
    },
  })
}

export function* getConnectedAccount(): Generator<Effect, string | null> {
  const provider = yield* select(providerSelector.provider)
  const accounts = provider
    ? ((yield* apply(provider, provider.send, [
        MetamaskActions.requestAccounts,
        [],
      ])) as string[])
    : []

  return accounts && accounts.length > 0 ? accounts[0] : null
}

export async function ethereumRequestMethod<T>(
  ethereum: MetaMaskInpageProvider,
  args: RequestArguments,
): Promise<T> {
  return ((await ethereum.request<T>(args)) as unknown) as Promise<T>
}

export type EthereumRequestType<T> = (
  ethereum: MetaMaskInpageProvider,
  agr: RequestArguments,
) => Promise<T>

export function* fetchMetaMaskConnectedAccount(
  ethereum: MetaMaskInpageProvider,
): Generator<Effect, string | null> {
  const accounts = yield* call<EthereumRequestType<string[]>>(
    ethereumRequestMethod,
    ethereum,
    {
      method: MetamaskActions.requestAccounts,
    },
  )

  return accounts && accounts.length > 0 ? accounts[0] : null
}

export function* getProviderNetwork(): Generator<Effect, string | null> {
  const provider = yield* select(providerSelector.provider)
  if (provider) {
    const network = yield* apply(provider, provider.getNetwork, [])

    return '0x' + network.chainId.toString(16)
  }

  return null
}
