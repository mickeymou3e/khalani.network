import { BigNumberish } from 'ethers';
import { PoolInitialLiquidity } from '../../../types';
import { ScriptRunEnvironment } from '../../../../types';

export interface ComposableStablePoolFactoryCreateParameters extends PoolInitialLiquidity {
  name: string;
  symbol: string;
  tokens: string[];
  rateProviders: string[];
  priceRateCacheDuration: BigNumberish[];
  swapFeePercentage: BigNumberish;
  amplificationParameter: BigNumberish;
  exemptFromYieldProtocolFeeFlags: boolean[];
  owner: string;
  environment: ScriptRunEnvironment;
}
