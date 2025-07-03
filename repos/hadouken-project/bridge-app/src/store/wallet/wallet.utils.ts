import { providers } from 'ethers'
import { CallEffect, Effect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import config from '@config'
import { MetamaskActions } from '@constants/Ethereum'
import { TokenModel } from '@interfaces/tokens'
import detectEthereumProvider from '@metamask/detect-provider'
import { MetaMaskInpageProvider } from '@metamask/inpage-provider'
import { getNetworkName } from '@utils/network'

import { ethereumRequest } from './wallet.types'

/**
 * 'any' which if specified means the Provider will allow the backend network to change, meaning the network is not immutable
 */
const ETHERS_ISSUE_866 = 'any'

export const getEthereumWeb3Provider = (): providers.JsonRpcProvider => {
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

export const getGodwokenWebsocketProvider = (): providers.WebSocketProvider | null => {
  const metaMaskProvider = getMetaMaskProvider()

  if (metaMaskProvider) {
    const wsProvider = new providers.WebSocketProvider(
      config.ckb.godwoken.wsUrl,
      Number(config.ckb.godwoken.networkId),
    )

    return wsProvider
  }

  return null
}

export function* getMetamaskProvider(): Generator<
  CallEffect,
  MetaMaskInpageProvider | undefined
> {
  const metamaskProvider: MetaMaskInpageProvider = (yield* call(
    detectEthereumProvider,
  )) as MetaMaskInpageProvider

  if (metamaskProvider) {
    return metamaskProvider
  } else {
    console.error('Please install MetaMask!')
    throw new Error('MetaMask not installed')
  }
}

export const getMetaMaskProvider = (): MetaMaskInpageProvider =>
  window?.ethereum as MetaMaskInpageProvider

export function* AuthorizeWallet(ethereum: MetaMaskInpageProvider): Generator {
  yield* call<ethereumRequest<string[]>>(ethereum.request, {
    method: MetamaskActions.requestWallet,
    params: [{ eth_accounts: {} }],
  })
}

export function* switchNetwork(
  networkId: string,
  ethereum: MetaMaskInpageProvider,
): Generator {
  yield* call<ethereumRequest<string[]>>(ethereum.request, {
    method: MetamaskActions.switchNetwork,
    params: [{ chainId: networkId }],
  })
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
  ethereum: MetaMaskInpageProvider,
): Generator {
  yield* call(ethereum.request, {
    method: MetamaskActions.addNetwork,
    params: [
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
  })
}

export function* addTokenToMetaMask(
  ethereum: MetaMaskInpageProvider,
  token: TokenModel,
): Generator {
  yield* call(ethereum.request, {
    method: MetamaskActions.watchAsset,
    params: {
      type: 'ERC20',
      options: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals.toString(),
      },
    },
  })
}

export function* fetchMetaMaskConnectedAccount(
  ethereum: MetaMaskInpageProvider,
): Generator<Effect, string> {
  const accounts = yield* call<ethereumRequest<string[]>>(ethereum.request, {
    method: MetamaskActions.requestAccounts,
  })
  return accounts && accounts.length > 0 ? accounts[0] : null
}

/**
 * Godwoken Account existance check is done by simple performing call to Godwoken
 * @returns {boolean} - Godwoken call status
 */

export function* addGodwokenNetworkToWallet(
  ethereum: MetaMaskInpageProvider,
): Generator {
  yield* call(ethereum.request, {
    method: MetamaskActions.addNetwork,
    params: [
      {
        chainId: config.godwoken.chainId,
        chainName: getNetworkName(config.ckb.godwoken.networkId),
        nativeCurrency: {
          name: 'CKB',
          symbol: 'CKB',
          decimals: 18,
        },
        rpcUrls: [config.ckb.godwoken.rpcUrl],
        blockExplorerUrls: [config.ckb.ckb.url],
      },
    ],
  })
}

export function* addBinanceNetworkToWallet(
  ethereum: MetaMaskInpageProvider,
): Generator {
  const chainId = config.bridge.bsc.chainId.toString()

  yield* call(ethereum.request, {
    method: MetamaskActions.addNetwork,
    params: [
      {
        chainId: String(chainId),
        chainName: getNetworkName(config.bridge.bsc.chainId),
        nativeCurrency: config.bridge.bsc.nativeCurrency,
        rpcUrls: [config.bridge.bsc.rpcUrl],
        blockExplorerUrls: [config.bridge.bsc.explorerUrl],
      },
    ],
  })
}

export const getNativeTokenSymbol = (chainId: string): string => {
  switch (chainId) {
    case config.godwoken.chainId:
      return config.godwoken.nativeCurrency.symbol
    case config.bridge.ethereum.chainId:
      return config.bridge.ethereum.nativeCurrency.symbol
    case config.bridge.bsc.chainId:
      return config.bridge.bsc.nativeCurrency.symbol
    default:
      return ''
  }
}
