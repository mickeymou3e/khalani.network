import { BigNumber } from 'ethers'

import { RequestStatus } from '@constants/Request'
import { IInitializeSaga } from '@interfaces/data'
import { RequestArguments } from '@metamask/inpage-provider/dist/BaseProvider'
import { PayloadAction } from '@reduxjs/toolkit'

export type ethereumRequest<T> = (args: RequestArguments) => Promise<T>

export class WalletReduxState implements IInitializeSaga {
  public status: RequestStatus = RequestStatus.Idle
  public ethAddress: string = null
  public ckbAddress: string = null
  public chainId: string = null
  public networkName: string = null
  public nativeTokenBalance: BigNumber | null = null
  public connectionState: ConnectionState = ConnectionState.None
  public connectionStateStatus: ConnectionStatus = ConnectionStatus.pending
  public connectToMetaMaskStatus: RequestStatus = RequestStatus.Idle
  public errorMessage: string = null
}

export type InitializeWalletResponse = {
  ethAddress: WalletReduxState['ethAddress']
  ckbAddress: WalletReduxState['ckbAddress']
  nativeTokenBalance: WalletReduxState['nativeTokenBalance']
  chainId: WalletReduxState['chainId']
}

export enum ConnectionState {
  None,
  Select,
  Install,
  Authorize,
  ChangeNetwork,
  Connected,
}

export const enum ConnectionStatus {
  pending,
  fail,
  success,
}

export type ConnectionStateStatusParams = PayloadAction<
  Required<{
    connectionState: ConnectionState
    status: ConnectionStatus
  }>
>
