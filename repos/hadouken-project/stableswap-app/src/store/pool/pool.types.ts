import { IInitializeSaga } from '@interfaces/data'

export interface ByPoolId<T> {
  [key: string]: T
}

export type IPoolsSagaState = IInitializeSaga & { isFetching: boolean }
export type IPoolsHistorySagaState = IInitializeSaga
