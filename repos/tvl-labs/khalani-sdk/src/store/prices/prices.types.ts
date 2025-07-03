import { RequestStatus } from '@constants/Request'
import { BigDecimal } from '@utils/math'

export interface IPriceSliceState {
  status: RequestStatus
}

export interface IPrice {
  id: string
  price: BigDecimal
  tokenSymbol?: string
}

export type Id = string
