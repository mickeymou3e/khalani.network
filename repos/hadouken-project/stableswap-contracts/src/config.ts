import { GodwokenNetwork, Config } from './types'
import ConfigJSON from './config.json'

export const getConfig = (networkId: GodwokenNetwork) => {
    const configByNetwork = ConfigJSON as { [key in GodwokenNetwork]: Config }
    return configByNetwork[networkId]
}