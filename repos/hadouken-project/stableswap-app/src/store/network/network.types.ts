import { Network } from '@constants/Networks'
import { IInitializeSaga } from '@interfaces/data'

export interface INetworkSliceState extends IInitializeSaga {
  walletChainId: Network | null
  walletNetworkName: string | null
  applicationChainId: string | null
  applicationNetworkName: string | null
  latestBlock: number | null
}
