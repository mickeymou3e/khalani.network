import { ITokenFetchValue } from '@interfaces/tokens'

export interface IBalance {
  balances: {
    [key: string]: ITokenFetchValue
  }
  id: string
}
