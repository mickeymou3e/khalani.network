import { oneRay } from '@src/constants';
import BigNumber from 'bignumber.js';

import { IInterestRateStrategyParams } from '@src/types';

// CKB
export const rateStrategyCKB: IInterestRateStrategyParams = {
  name: 'rateStrategyCKB',
  optimalUtilizationRate: new BigNumber(0.45).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.07).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(3).multipliedBy(oneRay).toFixed(),
  baseStableBorrowRate: oneRay.multipliedBy(0.03).toFixed(),
  stableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(3).multipliedBy(oneRay).toFixed(),
};

// ETH
export const rateStrategyETH: IInterestRateStrategyParams = {
  name: 'rateStrategyETH',
  optimalUtilizationRate: new BigNumber(0.65).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.08).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(1).multipliedBy(oneRay).toFixed(),
  baseStableBorrowRate: oneRay.multipliedBy(0.03).toFixed(),
  stableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(1).multipliedBy(oneRay).toFixed(),
};

// MNT
export const rateStrategyMNT: IInterestRateStrategyParams = {
  name: 'rateStrategyMNT',
  optimalUtilizationRate: new BigNumber(0.65).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.08).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(1).multipliedBy(oneRay).toFixed(),
  baseStableBorrowRate: oneRay.multipliedBy(0.03).toFixed(),
  stableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(1).multipliedBy(oneRay).toFixed(),
};

// ETH
export const rateStrategyWETH: IInterestRateStrategyParams = {
  name: 'rateStrategyETH',
  optimalUtilizationRate: new BigNumber(0.65).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.08).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(1).multipliedBy(oneRay).toFixed(),
  baseStableBorrowRate: oneRay.multipliedBy(0.03).toFixed(),
  stableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(1).multipliedBy(oneRay).toFixed(),
};

// BTC
export const rateStrategyBTC: IInterestRateStrategyParams = {
  name: 'rateStrategyBTC',
  optimalUtilizationRate: new BigNumber(0.65).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.07).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(1).multipliedBy(oneRay).toFixed(),
  baseStableBorrowRate: oneRay.multipliedBy(0.03).toFixed(),
  stableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(1).multipliedBy(oneRay).toFixed(),
};

// ADA
export const rateStrategyADA: IInterestRateStrategyParams = {
  name: 'rateStrategyADA',
  optimalUtilizationRate: new BigNumber(0.45).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(3).multipliedBy(oneRay).toFixed(),
  baseStableBorrowRate: oneRay.multipliedBy(0.03).toFixed(),
  stableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(3).multipliedBy(oneRay).toFixed(),
};

// BNB
export const rateStrategyBNB: IInterestRateStrategyParams = {
  name: 'rateStrategyBNB',
  optimalUtilizationRate: new BigNumber(0.45).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(3).multipliedBy(oneRay).toFixed(),
  baseStableBorrowRate: oneRay.multipliedBy(0.03).toFixed(),
  stableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(3).multipliedBy(oneRay).toFixed(),
};

// USDC
export const rateStrategyUSDC: IInterestRateStrategyParams = {
  name: 'rateStrategyUSDC',
  optimalUtilizationRate: new BigNumber(0.9).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.04).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(0.6).multipliedBy(oneRay).toFixed(),
  baseStableBorrowRate: oneRay.multipliedBy(0.04).toFixed(),
  stableRateSlope1: new BigNumber(0.02).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(0.6).multipliedBy(oneRay).toFixed(),
};

// USDT
export const rateStrategyUSDT: IInterestRateStrategyParams = {
  name: 'rateStrategyUSDT',
  optimalUtilizationRate: new BigNumber(0.9).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.04).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(0.6).multipliedBy(oneRay).toFixed(),
  baseStableBorrowRate: oneRay.multipliedBy(0.035).toFixed(),
  stableRateSlope1: new BigNumber(0.02).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(0.6).multipliedBy(oneRay).toFixed(),
};
