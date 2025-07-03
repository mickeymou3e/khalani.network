import { BigNumberish } from 'ethers';
import { PoolInitialLiquidity } from '../../../types';
import { Wallet } from 'zksync-web3';

export interface AaveLinearPoolFactoryCreateParameters extends PoolInitialLiquidity {
  name: string;
  symbol: string;
  underlyingToken: string;
  wrappedToken: string;
  upperTarget: BigNumberish;
  swapFeePercentage: BigNumberish;
  owner: string;
}

export interface ZkSyncAaveLinearPoolFactoryCreateParameters extends AaveLinearPoolFactoryCreateParameters {
  wallet: Wallet;
}
