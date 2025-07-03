export interface IPoolSharesQueryResult {
  users: {
    id: string
    sharesOwned: {
      balance: string
      poolId: {
        id: string
        address: string
      }
    }[]
  }[]
}
