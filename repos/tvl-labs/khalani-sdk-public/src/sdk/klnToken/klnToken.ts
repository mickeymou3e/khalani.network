import { Address } from '@store/tokens/tokens.types'
import { Token } from '../token'
import { Amount, DecimalType } from '../amount'
import { KlnTokenName } from './klnTokenName'
import { KlnTokenSymbol } from './klnTokenSymbol'

/**
 * klnUSD token.
 */
export class KlnToken implements Token {
  readonly id: string
  readonly name: KlnTokenName
  readonly symbol: KlnTokenSymbol
  readonly address: Address
  readonly decimals: DecimalType
  balance?: Amount

  constructor(
    id: string,
    name: KlnTokenName,
    symbol: KlnTokenSymbol,
    address: Address,
    decimals: DecimalType,
  ) {
    this.id = id
    this.name = name
    this.address = address
    this.decimals = decimals
    this.symbol = symbol
  }

  static KAI(): 'KAI' {
    return 'KAI'
  }

  updateBalance(balance: Amount) {
    if (this.decimals !== balance.decimals) {
      throw new Error(
        `Decimals changed ${this.decimals} vs ${balance.decimals}`,
      )
    }
    this.balance = balance
  }
}
