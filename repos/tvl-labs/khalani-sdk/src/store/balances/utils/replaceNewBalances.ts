import { IBalances } from '../balances.types'

export const replaceNewBalances = (
  balances: IBalances[],
  newBalances: IBalances[],
): IBalances[] => {
  const result: IBalances[] = []
  newBalances.map((newBalance, index) => {
    const foundBalance = balances.find(
      (balance) => balance.id === newBalance.id,
    )

    if (foundBalance?.balance !== newBalance.balance) {
      balances.splice(index, 1)
      result.push(newBalance)
    } else if (foundBalance?.balance === newBalance.balance) {
      return
    } else {
      result.push(newBalance)
    }
  })

  return [...balances, ...result]
}
