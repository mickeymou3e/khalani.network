import { getNetworkName, Network } from '@constants/Networks'
import { Amount, DecimalType } from '../amount'
import { Address } from '@store/tokens/tokens.types'
import { UsdTokenName } from './usdTokenName'
import { UsdTokenSymbol } from './usdTokenSymbol'
import { Token } from '../token'

/**
 * Tokens living on the end chains.
 */
export class UsdToken implements Token {
  readonly name: UsdTokenName
  readonly network: Network
  readonly address: Address
  readonly decimals: DecimalType
  readonly symbol: UsdTokenSymbol
  balance?: Amount

  constructor(
    name: UsdTokenName,
    network: Network,
    address: Address,
    decimals: DecimalType,
    symbol: UsdTokenSymbol,
  ) {
    this.name = name
    this.network = network
    this.address = address
    this.decimals = decimals
    this.symbol = symbol
  }

  updateBalance(balance: Amount) {
    if (this.decimals !== balance.decimals) {
      throw new Error(
        `Decimals changed ${this.decimals} vs ${balance.decimals}`,
      )
    }
    this.balance = balance
  }

  id(): string {
    return this.network + ':' + this.address
  }

  toString(): string {
    return this.name + ' (on ' + getNetworkName(this.network) + ')'
  }
}
