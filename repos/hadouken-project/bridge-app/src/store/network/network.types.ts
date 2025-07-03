import { IInitializeSaga } from '@interfaces/data'

export interface INetworkSliceState extends IInitializeSaga {
  network: string | null
  expectedNetwork: string | null
  latestBlock: number | null
}
