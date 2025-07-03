import CommonConfig from '../config/config.common.json'
import StagingConfig from '../config/config.staging.json'
import TestnetConfig from '../config/config.testnet.json'
import { EnvironmentType } from './constants'

export const networkType = process.env.NETWORK

const getConfigByEnvironment = (environment: string | undefined) => {
  switch (environment) {
    case EnvironmentType.Staging:
      return StagingConfig
    case EnvironmentType.Testnet:
      return TestnetConfig
    default:
      return StagingConfig
  }
}

const currentEnvironment = process.env.TYPE
const environmentConfig = getConfigByEnvironment(currentEnvironment)
const combinedConfig = { ...CommonConfig, ...environmentConfig }

export default combinedConfig
