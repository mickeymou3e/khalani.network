import { Environment } from '@hadouken-project/config'
import { Environments } from '@hadouken-project/lending-contracts'

import ChainConfigGodwokenMainnet from '../config/chain/config.godwoken-mainnet.json'
import ChainConfigGodwokenTestnet from '../config/chain/config.godwoken-testnet.json'
import ChainConfigMantleMainnet from '../config/chain/config.mantle-mainnet.json'
import ChainConfigMantleTestnet from '../config/chain/config.mantle-testnet.json'
import ChainConfigZkSyncMainnet from '../config/chain/config.zksync-mainnet.json'
import ChainConfigZkSyncTestnet from '../config/chain/config.zksync-testnet.json'
import { Config } from './config.types'
import { Network as NetworkId } from './constants/Networks'
import { env } from './utils/network'

export const getChainConfig = (chainId: string): Config => {
  if (chainId === NetworkId.GodwokenMainnet) {
    return ChainConfigGodwokenMainnet
  } else if (chainId === NetworkId.GodwokenTestnet) {
    return ChainConfigGodwokenTestnet
  } else if (chainId === NetworkId.ZksyncTestnet) {
    return ChainConfigZkSyncTestnet
  } else if (chainId === NetworkId.ZksyncMainnet) {
    return ChainConfigZkSyncMainnet
  } else if (chainId === NetworkId.MantleTestnet) {
    return ChainConfigMantleTestnet
  } else if (chainId === NetworkId.MantleMainnet) {
    return ChainConfigMantleMainnet
  }

  return ChainConfigGodwokenMainnet
}

export const getBackstopEnvironment = (): Environments => {
  if (env === Environment.Mainnet) {
    return 'mainnet'
  } else if (env === Environment.Testnet) {
    return 'testnet'
  }

  return 'mainnet'
}

export const getLendingEnvironment = (): Environments => {
  if (env === Environment.Mainnet) {
    return 'mainnet'
  } else if (env === Environment.Testnet) {
    return 'testnet'
  }

  return 'mainnet'
}
