import { UsdToken } from '../usdToken/usdToken';
import { Address } from '@store/tokens/tokens.types';
import { DecimalType } from '../amount';
import { MirrorTokenName } from './mirrorTokenName';
import { MirrorTokenSymbol } from './mirrorTokenSymbol';
import { Token } from '../token';

/**
 * ERC20 tokens mirroring source chains' USD tokens.
 */
export class MirrorToken implements Token {
  constructor(
    public readonly mirroredToken: UsdToken,
    public readonly address: Address,
    public readonly name: MirrorTokenName,
    public readonly symbol: MirrorTokenSymbol,
    public readonly decimals: DecimalType
  ) {
    if (mirroredToken.name === "KAI") {
      throw new Error("There is no mirror token for KAI, use KaiToken class instead.");
    }
  }
}