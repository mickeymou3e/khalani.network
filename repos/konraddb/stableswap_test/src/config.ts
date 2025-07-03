import ConfigAxon from '../config/config.axon.json'
import ConfigBeta from '../config/config.beta.json'
import ConfigProd from '../config/config.prod.json'
import ConfigTestnet from '../config/config.testnet.json'

const config = (() => {
  if (process.env.CONFIG === 'prod') {
    return ConfigProd
  } else if (process.env.CONFIG === 'beta') {
    return ConfigBeta
  } else if (process.env.CONFIG === 'testnet') {
    return ConfigTestnet
  } else if (process.env.CONFIG === 'axon') {
    return ConfigAxon
  }

  return ConfigProd
})()

export default config
