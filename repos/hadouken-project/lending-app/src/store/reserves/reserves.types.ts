import { IInitializeSaga } from '@interfaces/data'

export interface ByTokenAddress<T> {
  [key: string]: T
}

export type IReservesSagaState = IInitializeSaga
