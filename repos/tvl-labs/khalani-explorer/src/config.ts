import ConfigAxon from '../config/config.axon.json'
import ConfigSchema from '../config/config.schema.json'
import ArbitrumTokens from '../config/tokens/arbitrum.tokens.json'
import BscTokens from '../config/tokens/bsc.tokens.json'
import FujiTokens from '../config/tokens/fuji.tokens.json'
import GodwokenTokens from '../config/tokens/godwoken.tokens.json'
import KhalaTokens from '../config/tokens/khala.tokens.json'
import MumbaiTokens from '../config/tokens/mumbai.tokens.json'
import OptimismTokens from '../config/tokens/optimism.tokens.json'
import SepoliaTokens from '../config/tokens/sepolia.tokens.json'

const config: typeof ConfigSchema = ConfigAxon

config.tokens = [
  ...FujiTokens,
  ...SepoliaTokens,
  ...BscTokens,
  ...ArbitrumTokens,
  ...KhalaTokens,
  ...OptimismTokens,
  ...GodwokenTokens,
  ...MumbaiTokens,
] as typeof ConfigSchema['tokens']

let cachedBalancerChain:
  | typeof ConfigSchema['supportedChains'][0]
  | undefined = undefined
export function getBalancerChain(): typeof ConfigSchema['supportedChains'][0] {
  if (!cachedBalancerChain) {
    cachedBalancerChain = config.supportedChains.find((i) => i.isBalancerChain)
  }

  if (typeof cachedBalancerChain === 'undefined') {
    throw new Error(`Can't find balancerChain in config.`)
  }

  return cachedBalancerChain
}

export default config
