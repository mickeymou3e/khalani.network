import { ActionInProgress } from '@interfaces/action'

export interface ContractsSliceState {
  errorMessage?: string
  actionInProgress?: ActionInProgress
}
