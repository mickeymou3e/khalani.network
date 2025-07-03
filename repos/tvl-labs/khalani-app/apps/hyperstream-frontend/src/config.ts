import { EnvironmentType } from '@shared/constants'

import CommonConfig from '../../../config/config.common.json'
import StagingConfig from '../../../config/config.staging.json'
import TestnetConfig from '../../../config/config.testnet.json'

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
