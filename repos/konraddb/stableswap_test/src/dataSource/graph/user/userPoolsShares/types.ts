import { Address } from '@interfaces/data'

export interface IPoolSharesQueryResult {
  users: {
    id: string
    sharesOwned: {
      balance: string
      poolId: {
        id: string
        address: Address
      }
    }[]
  }[]
}
