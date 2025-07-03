import config from '@config'
import ConfigSchema from '../../config/config.schema.json'

let cachedBalancerChain:
  | (typeof ConfigSchema)['supportedChains'][0]
  | undefined = undefined
export function getBalancerChain(): (typeof ConfigSchema)['supportedChains'][0] {
  if (!cachedBalancerChain) {
    cachedBalancerChain = config.supportedChains.find((i) => i.isBalancerChain)
  }

  if (typeof cachedBalancerChain === 'undefined') {
    throw new Error(`Can't find balancerChain in config.`)
  }

  return cachedBalancerChain
}
