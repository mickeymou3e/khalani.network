import { IInitializeSaga } from '@interfaces/data'

export interface ByTokenAddress<T> {
  [key: string]: T
}

export type ITokensSagaState = IInitializeSaga
