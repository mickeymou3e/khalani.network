import { IInitializeSaga } from '@interfaces/data'
import { BigDecimal } from '@utils/math'

export type IPriceSliceState = IInitializeSaga

export interface IPrice {
  id: string
  price: BigDecimal
}
