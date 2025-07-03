import { Network } from '@constants/Networks'
import { FallbackProvider, JsonRpcProvider, Signer } from 'ethers-v6'
import { Signer as Signerv5 } from 'ethers'

import { Address } from '@store/tokens/tokens.types'

export interface ProviderSliceState {
  provider: JsonRpcProvider | FallbackProvider | null
  signer: Signer | null
  signerv5: Signerv5 | null
  network: Network | null
  userAddress: Address | null
}
