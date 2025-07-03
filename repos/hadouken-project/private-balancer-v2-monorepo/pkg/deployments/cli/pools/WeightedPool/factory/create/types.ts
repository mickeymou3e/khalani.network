import { BigNumberish } from 'ethers';
import { PoolInitialLiquidity } from '../../../types';
import { ScriptRunEnvironment } from '../../../../types';

export interface WeightedPoolFactoryCreateParameters extends PoolInitialLiquidity {
  name: string;
  symbol: string;
  tokens: string[];
  weights: BigNumberish[];
  rateProviders: string[];
  swapFeePercentage: BigNumberish;
  delegate: string;
  environment: ScriptRunEnvironment;
}
