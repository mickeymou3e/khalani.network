import { Network } from '@tvl-labs/sdk'

import { networkType } from '../../config'

/**
 * Default chain to be used for the origin when hard to determine otherwise.
 * For example, when the currently connected chain is Khalani Chain, the bridge page should insist
 * on making the origin chain to be non Khalani Chain.
 */
export const DEFAULT_NETWORK =
  networkType === 'testnet' ? Network.ArbitrumSepolia : Network.Ethereum
