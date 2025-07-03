import { Token } from './token';
import { Amount } from './amount';

export interface Approvable {
  getAllowance(token: Token): Promise<Amount | undefined>;

  approve(token: Token, newAllowance: Amount): void;
}