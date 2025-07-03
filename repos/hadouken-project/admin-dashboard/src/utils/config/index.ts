import { Environments, getConfig } from '@hadouken-project/lending-contracts'
import { Config } from '@hadouken-project/lending-contracts/dist/types'
import { AppConfig, AppEnvironment } from '@interfaces/config'
import { APP_ENVIRONMENT } from '@utils/stringOperations'

import GodwokenMainnetConfig from '../../../config/config-godwoken-mainnet.json'
import GodwokenTestnetConfig from '../../../config/config-godwoken-testnet.json'
import MantleTestnetConfig from '../../../config/config-mantle-testnet.json'
import ZksyncTestnetConfig from '../../../config/config-zksync-testnet.json'

export const getEnvConfig = (env: AppEnvironment): AppConfig => {
  if (env === 'godwoken-mainnet') {
    return GodwokenMainnetConfig
  } else if (env === 'godwoken-testnet') {
    return GodwokenTestnetConfig
  } else if (env === 'zksync-testnet') {
    return ZksyncTestnetConfig
  } else if (env === 'mantle-testnet') {
    return MantleTestnetConfig
  }

  throw Error('env not found')
}

export const getAppConfig = (): AppConfig => {
  const env = APP_ENVIRONMENT
  const config = getEnvConfig(env)

  return config
}

export const getContractsConfig = (): Config => {
  const env = APP_ENVIRONMENT
  const config = getEnvConfig(env)
  const contractsConfig = getConfig(config.chain)?.(
    config.contractsEnv as Environments,
  ) as Config

  return contractsConfig
}
