import { IInitializeSaga } from '@interfaces/data'
import { Balances } from '@interfaces/token'

export type IBalanceSagaState = IInitializeSaga & { isFetching: boolean }

export interface IBalance {
  id: string
  balances: Balances
}
