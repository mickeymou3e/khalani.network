import { Address } from '@store/tokens/tokens.types';
import { Token } from '../token';
import { DecimalType } from '../amount';

/**
 * KAI token living on the Khalani chain.
 */
export class KaiToken implements Token {

  static readonly KAI = "KAI";

  constructor(
    readonly name: typeof KaiToken.KAI,
    readonly symbol: typeof KaiToken.KAI,
    readonly address: Address,
    readonly decimals: DecimalType
  ) {
  }
}