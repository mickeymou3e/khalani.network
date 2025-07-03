import { IInitializeSaga } from '@interfaces/data'
import { BigDecimal } from '@utils/math'

export type IUserShareSagaState = IInitializeSaga

export interface IUserShares {
  sharesOwned: {
    [key: string]: BigDecimal
  }
  id: string
}
