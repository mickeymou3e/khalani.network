import { Address } from '@store/tokens/tokens.types';
import { DecimalType } from './amount';

export interface Token {
  address: Address;
  symbol: string;
  decimals: DecimalType;
}