import { BigNumberish } from 'ethers';
import { PoolInitialLiquidity } from '../../../types';
import { ScriptRunEnvironment } from '../../../../types';

export interface AaveLinearPoolFactoryCreateParameters extends PoolInitialLiquidity {
  name: string;
  symbol: string;
  underlyingToken: string;
  wrappedToken: string;
  upperTarget: BigNumberish;
  swapFeePercentage: BigNumberish;
  owner: string;
  environment: ScriptRunEnvironment;
}
