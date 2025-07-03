import { IKhalaBalances } from '../balances.types'

export const replaceNewBalances = (
  balances: IKhalaBalances[],
  newBalances: IKhalaBalances[],
): IKhalaBalances[] =>
  balances.map((balance) => {
    const foundNewBalance = newBalances.find(
      (newBalance) => newBalance.id === balance.id,
    )
    return foundNewBalance || balance
  })
