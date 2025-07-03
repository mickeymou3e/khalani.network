export enum ConnectionStageType {
  Idle = 'Idle',
  SelectWallet = 'SelectWallet',
  InstallWallet = 'InstallWallet',
  ConnectWallet = 'ConnectWallet',
  ChangeNetwork = 'ChangeNetwork',
  Connected = 'Connected',
}

export const enum ConnectionStageStatus {
  Pending = 'Pending',
  Fail = 'Fail',
  Success = 'Success',
}

export enum WalletType {
  MetaMask = 'MetaMask',
  SafePal = 'SafePal',
}

export interface SelectWalletPendingPayload {
  type: WalletType
}

export type ConnectionStagePayload = SelectWalletPendingPayload

export type SelectWalletConnectionStage = ConnectionStage<SelectWalletPendingPayload>

export interface ConnectionStage<P = ConnectionStagePayload> {
  type: ConnectionStageType
  status: ConnectionStageStatus
  payload?: P
}

export interface ConnectionState {
  status: ConnectionStageStatus
  stage: ConnectionStageType
}
