import { Network } from '../../constants/Networks'
import { providers } from 'ethers'

import { RequestStatus } from '../../constants/Request'
import { Address } from '../../store/tokens/tokens.types'

export interface ProviderSliceState {
  status: RequestStatus
  provider: providers.Web3Provider | null
  signer: providers.JsonRpcSigner | null
  network: Network | null
  userAddress: Address | null
}
