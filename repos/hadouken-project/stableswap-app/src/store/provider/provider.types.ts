import { providers } from 'ethers'

import { RequestStatus } from '@constants/Request'

export enum EventName {
  Block = 'block',
}

export interface ProviderSliceState {
  status: RequestStatus
  provider: providers.Web3Provider | null
}
