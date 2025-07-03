import { BigNumber } from 'ethers'

import { RequestStatus } from '@constants/Request'
import { IInitializeSaga } from '@interfaces/data'
import { RequestArguments } from '@metamask/inpage-provider/dist/BaseProvider'

import {
  ConnectionStage,
  ConnectionStagePayload,
  ConnectionStageStatus,
  ConnectionStageType,
} from './connection/types'

export type ethereumRequest<T> = (args: RequestArguments) => Promise<T>

export class WalletState implements IInitializeSaga {
  public status: RequestStatus = RequestStatus.Idle
  public ethAddress: string | null = null
  public godwokenShortAddress: string | null = null
  public ckbAddress: string | null = null
  public connectionStage: ConnectionStage<ConnectionStagePayload> = {
    type: ConnectionStageType.Idle,
    status: ConnectionStageStatus.Pending,
  }
  public creatingLayer2Account: boolean | null = null
  public errorMessage: string | null = null
  public lastTx: string | null = null
  public nativeTokenBalance: BigNumber | null = null
  public isOpenNetworkModal = false
}

export type InitializeWalletResponse = {
  ethAddress: string | null
  godwokenShortAddress: string | null
  ckbAddress: string | null
  nativeTokenBalance: BigNumber | null
}
