import { IBalances } from '@store/balances/balances.types'
import { BigNumber } from 'ethers'

// Convert BigInt to BigNumber
export const bigIntToBigNumber = (value: bigint) => BigNumber.from(value)

// Convert BigNumber to BigInt
export const bigNumberToBigInt = (value: BigNumber) => BigInt(value.toString())

export const stringifyBalanceWithBigIntsToString = (balances: IBalances[]) =>
  JSON.stringify(balances, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  )
