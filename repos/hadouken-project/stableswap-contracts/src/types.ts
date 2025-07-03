import { SwapTemplateBase } from "./contracts";

export enum Networks {
  Godwoken,
  Ethereum
}

export enum EthereumNetwork {
  Mainnet = '0x1',
  Ropsten = '0x3',
  Kovan = '0x2a',
  Rinkeby = '0x4',
  Goerli = '0x5',
  Dev = '0x539'
}

export enum GodwokenNetwork {
  Mainnet = '0x116e2',
  Testnet = '0x116e1',
  Devnet = '0xfa309'
}

export const BridgeNetworkPair = {
  [EthereumNetwork.Rinkeby]: GodwokenNetwork.Testnet
}

export const getEthereumNetworkName = (chainId: string): string => {
  if (chainId === null) return "unknown"

  switch (chainId) {
    case EthereumNetwork.Mainnet:
      return "homestead"
    case EthereumNetwork.Ropsten:
      return "ropsten"
    case EthereumNetwork.Rinkeby:
      return "rinkeby"
    case EthereumNetwork.Goerli:
      return "kovan"
    case EthereumNetwork.Dev:
      return "goerli"
  }

  return "unknown"
}

export type Pool = SwapTemplateBase

export interface Config {
  env: string
  timeout: number
  nervos: {
    ckb: {
      url: string
    },
    godwoken: {
      rpcUrl: string
      wsUrl: string
      networkId: string
    },
    indexer: {
      url: string
    },
    rollupTypeHash: string
    rollupTypeScript: {
      codeHash: string
      hashType: string
      args: string
    },
    ethAccountLockCodeHash: string
    depositLockScriptTypeHash: string
    portalWalletLockHash: string
  },
  ethereum: {
    networkId: string,
    fallback: {
      rpcUrl: string,
      infura: {
        apiKey: string,
      },
    },
  },
}
