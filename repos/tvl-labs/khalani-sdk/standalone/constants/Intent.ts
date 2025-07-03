import { IntentDomain, IntentType } from '../types'
import { NetworkType } from '../config'
import { loadConfig } from '../config'

const getIntentDomain = (networkType: NetworkType): IntentDomain => {
  const config = loadConfig(networkType)
  return {
    name: 'KhalaniIntent',
    version: '1.0.0',
    verifyingContract: config.contracts.IntentBook as `0x${string}`,
  }
}

const getIntentTypes = (): Record<string, IntentType[]> => ({
  Intent: [
    { name: 'author', type: 'address' },
    { name: 'ttl', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'srcMToken', type: 'address' },
    { name: 'srcAmount', type: 'uint256' },
    { name: 'outcome', type: 'Outcome' },
  ],
  Outcome: [
    { name: 'mTokens', type: 'address[]' },
    { name: 'mAmounts', type: 'uint256[]' },
    { name: 'outcomeAssetStructure', type: 'uint8' },
    { name: 'fillStructure', type: 'uint8' },
  ],
})

export { getIntentDomain, getIntentTypes }
