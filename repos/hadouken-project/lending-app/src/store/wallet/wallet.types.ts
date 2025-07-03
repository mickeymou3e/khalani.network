import { RequestStatus } from '@constants/Request'
import { IInitializeSaga } from '@interfaces/data'
import { MetaMaskInpageProvider } from '@metamask/inpage-provider'
import { RequestArguments } from '@metamask/inpage-provider/dist/BaseProvider'
import { PayloadAction } from '@reduxjs/toolkit'

export type EthereumRequestType<T> = (
  ethereum: MetaMaskInpageProvider,
  agr: RequestArguments,
) => Promise<T>

export class WalletReduxState implements IInitializeSaga {
  public status: RequestStatus = RequestStatus.Idle
  public ethAddress: string | undefined = undefined
  public ckbAddress: string | undefined = undefined
  public applicationChainId: string | null = null
  public applicationNetworkName: string | undefined = undefined
  public connectionState: ConnectionState = ConnectionState.None
  public connectionStateStatus: ConnectionStatus = ConnectionStatus.pending
  public errorMessage: string | undefined = undefined
  public isOpenNetworkModal: boolean = false
  public walletNetworkName: string | undefined = undefined
  public walletChainId: string | null = null
}

export type InitializeWalletResponse = {
  ethAddress: string | undefined
  ckbAddress: string | undefined
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
