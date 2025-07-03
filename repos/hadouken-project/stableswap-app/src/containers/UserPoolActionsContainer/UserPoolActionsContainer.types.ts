import { IPool } from '@interfaces/pool'

export interface IUserPoolActionsContainerProps {
  poolId: IPool['id']
  onDeposit: () => void
  onWithdraw: () => void
}
