import ConfigTestnet from '../config/config.testnet.json'
import ConfigMainnet from '../config/config.mainnet.json'
import ConfigSchema from '../config/config.schema.json'

import TestnetChains from '../config/testnet/chains/testnet.chains.json'
import MainnetChains from '../config/mainnet/chains/mainnet.chains.json'

import FujiTokens from '../config/testnet/tokens/fuji.tokens.json'
import ArcadiaTestnetTokens from '../config/testnet/tokens/arcadia.tokens.json'
import ArbitrumTokens from '../config/testnet/tokens/arbitrum.tokens.json'
import OptimismTokens from '../config/testnet/tokens/optimism.tokens.json'
import SepoliaTokens from '../config/testnet/tokens/sepolia.tokens.json'
import BaseSepoliaTokens from '../config/testnet/tokens/base-sepolia.tokens.json'

import EthereumTokens from '../config/mainnet/tokens/ethereum.tokens.json'
import AvalancheTokens from '../config/mainnet/tokens/avalanche.tokens.json'
import ArcadiaMainnetTokens from '../config/mainnet/tokens/arcadia.tokens.json'
import ArbitrumOneTokens from '../config/mainnet/tokens/arbitrum.tokens.json'
import { NetworkType } from '@enums/index'

let config: typeof ConfigSchema

const network = process.env.NETWORK || NetworkType.TESTNET

if (network === NetworkType.MAINNET) {
  config = ConfigMainnet
  config.supportedChains =
    MainnetChains as (typeof ConfigSchema)['supportedChains']

  config.tokens = [
    ...AvalancheTokens,
    ...EthereumTokens,
    ...ArcadiaMainnetTokens,
    ...ArbitrumOneTokens,
  ] as (typeof ConfigSchema)['tokens']

  config.mTokens = ArcadiaMainnetTokens
} else if (network === NetworkType.TESTNET) {
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
  throw new Error(`Unsupported network: ${network}`)
}

export default config
