import ConfigMainnet from '../config/config.mainnet.json'
import ConfigSchema from '../config/config.schema.json'
import ConfigTestnet from '../config/config.testnet.json'

const config = ((): typeof ConfigSchema => {
  if (process.env.CONFIG === 'mainnet') {
    return ConfigMainnet
  } else if (process.env.CONFIG === 'testnet') {
    return ConfigTestnet
  }

  return ConfigMainnet
})()

export default config
