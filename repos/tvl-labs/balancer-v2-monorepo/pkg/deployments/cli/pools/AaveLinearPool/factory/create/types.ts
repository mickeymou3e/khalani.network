import { BigNumberish } from 'ethers';
import { PoolInitialLiquidity } from '../../../types';

export interface AaveLinearPoolFactoryCreateParameters extends PoolInitialLiquidity {
  name: string;
  symbol: string;
  mainToken: string;
  wrappedToken: string;
  upperTarget: BigNumberish;
  swapFeePercentage: BigNumberish;
  owner: string;
}
