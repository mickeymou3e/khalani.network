import { Network } from '@constants/Networks'
import { IInitializeSaga } from '@interfaces/data'

export interface INetworkSliceState extends IInitializeSaga {
  network: Network | null
  expectedNetwork: Network | null
  latestBlock: number | null
  reloaded: boolean | null
}
