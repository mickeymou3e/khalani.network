// contracts
import ConfigMainnet from './config/config.mainnet.json'
import ConfigSchema from './config/config.schema.json'
import ConfigTestnet from './config/config.testnet.json'
// chains
import MainnetChains from './config/mainnet/chains/mainnet.chains.json'
import TestnetChains from './config/testnet/chains/testnet.chains.json'
// tokens
import ArcadiaMainnetTokens from './config/mainnet/tokens/arcadia.tokens.json'
import EthereumTokens from './config/mainnet/tokens/ethereum.tokens.json'
import ArbitrumOneTokens from './config/mainnet/tokens/arbitrum.tokens.json'

import ArcadiaTestnetTokens from './config/testnet/tokens/arcadia.tokens.json'
import BaseSepoliaTokens from './config/testnet/tokens/base-sepolia.tokens.json'
import FujiTokens from './config/testnet/tokens/fuji.tokens.json'
import OptimismTokens from './config/testnet/tokens/optimism.tokens.json'
import SepoliaTokens from './config/testnet/tokens/sepolia.tokens.json'
import ArbitrumTokens from './config/testnet/tokens/arbitrum.tokens.json'

let config: typeof ConfigSchema
let _customConfig: typeof ConfigSchema | null = null

export enum NetworkType {
  testnet = 'testnet',
  mainnet = 'mainnet',
  devnet = 'devnet',
}

export function setCustomConfig(cfg: typeof ConfigSchema) {
  _customConfig = cfg
}

export const loadConfig = (networkType: NetworkType) => {
  if (_customConfig) {
    return _customConfig
  }
  if (networkType === NetworkType.mainnet) {
    config = ConfigMainnet
    config.supportedChains =
      MainnetChains as (typeof ConfigSchema)['supportedChains']

    config.tokens = [
      ...ArbitrumOneTokens,
      ...EthereumTokens,
      ...ArcadiaMainnetTokens,
    ] as (typeof ConfigSchema)['tokens']

    config.mTokens = ArcadiaMainnetTokens
  } else if (networkType === NetworkType.testnet) {
    config = ConfigTestnet
    config.supportedChains =
      TestnetChains as (typeof ConfigSchema)['supportedChains']

    config.tokens = [
      ...FujiTokens,
      ...ArcadiaTestnetTokens,
      ...ArbitrumTokens,
      ...OptimismTokens,
      ...SepoliaTokens,
      ...BaseSepoliaTokens,
    ] as (typeof ConfigSchema)['tokens']

    config.mTokens = ArcadiaTestnetTokens
  } else {
    throw new Error(`Unsupported network: ${networkType}`)
  }

  return config
}
