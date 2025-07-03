import { providers } from 'ethers'
import { CallEffect, Effect } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { MetamaskActions } from '@constants/Ethereum'
import { getConfig, getNetworkName } from '@hadouken-project/lending-contracts'
import { TokenModel } from '@interfaces/tokens'
import detectEthereumProvider from '@metamask/detect-provider'
import { MetaMaskInpageProvider } from '@metamask/inpage-provider'
import { RequestArguments } from '@metamask/inpage-provider/dist/BaseProvider'
import { ENVIRONMENT } from '@utils/stringOperations'

import { EthereumRequestType } from './wallet.types'

export async function ethereumRequestMethod<T>(
  ethereum: MetaMaskInpageProvider,
  args: RequestArguments,
): Promise<T> {
  return ((await ethereum.request<T>(args)) as unknown) as Promise<T>
}

/**
 * 'any' which if specified means the Provider will allow the backend network to change, meaning the network is not immutable
 */
const ETHERS_ISSUE_866 = 'any'

export const getEthereumWeb3Provider = (): providers.JsonRpcProvider | null => {
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

export function* getMetamaskProviderSaga(): Generator<
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
  yield* call<EthereumRequestType<string[]>>(ethereumRequestMethod, ethereum, {
    method: MetamaskActions.requestWallet,
    params: [{ eth_accounts: {} }],
  })
}

export function* switchNetwork(
  networkId: string | null,
  ethereum: MetaMaskInpageProvider,
): Generator {
  yield* call<EthereumRequestType<string[]>>(ethereumRequestMethod, ethereum, {
    method: MetamaskActions.switchNetwork,
    params: [{ chainId: networkId }],
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

/**
 * Godwoken Account existance check is done by simple performing call to Godwoken
 * @returns {boolean} - Godwoken call status
 */

export function* addNetworkToWallet(
  ethereum: MetaMaskInpageProvider,
  chainId: string,
): Generator {
  if (chainId) {
    const config = getConfig(chainId)?.(ENVIRONMENT)
    if (config) {
      yield* call(ethereum.request, {
        method: MetamaskActions.addNetwork,
        params: [
          {
            chainId: config.chainId,
            chainName: getNetworkName(config.chainId),
            nativeCurrency: {
              name: config.nativeToken.symbol,
              symbol: config.nativeToken.symbol,
              decimals: 18,
            },
            rpcUrls: [config.rpcUrl],
            blockExplorerUrls: [config.explorer],
          },
        ],
      })
    }
  }
}
