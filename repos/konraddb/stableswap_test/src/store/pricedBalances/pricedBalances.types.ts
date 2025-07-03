import { IInitializeSaga } from '@interfaces/data'
import { BigDecimal } from '@utils/math'

export type IBalanceSagaState = IInitializeSaga

export interface IBalance {
  id: string
  balances: {
    [key: string]: BigDecimal | null
  }
}
