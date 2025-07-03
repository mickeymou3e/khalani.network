import { addDotToLastDigit } from '@cli/utils';
import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { BigNumber } from 'ethers';

export async function getInterestRateStrategy(
  environment: ScriptRunEnvironment,
  token: { address: string; symbol: string }
) {
  const ray = 27;
  const percentage = 2;
  const decimals = ray - percentage;

  const lendingPool = connectToContractsRuntime(environment).pool;
  const lendingRateOracle = connectToContractsRuntime(environment).lendingRateOracle;

  if (!lendingPool) throw Error('Lending pool not found');
  if (!lendingRateOracle) throw Error('Lending rate oracle not found');

  const reserveData = await lendingPool.getReserveData(token.address, { gasPrice: 0 });
  const reserveStrategyContract = connectToContractsRuntime(environment).rateStrategy(
    reserveData.interestRateStrategyAddress
  );

  const utilizationRate = (await reserveStrategyContract.OPTIMAL_UTILIZATION_RATE())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const utilizationRateString = addDotToLastDigit(utilizationRate);

  const stableBorrowRate = (await lendingRateOracle.getMarketBorrowRate(token.address))
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const stableBorrowRateString = addDotToLastDigit(stableBorrowRate);

  const baseVariableBorrowRate = (await reserveStrategyContract.baseVariableBorrowRate())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const baseVariableBorrowRateString = addDotToLastDigit(baseVariableBorrowRate);

  const variableRateSlope1 = (await reserveStrategyContract.variableRateSlope1())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const variableRateSlope1String = addDotToLastDigit(variableRateSlope1);

  const variableRateSlope2 = (await reserveStrategyContract.variableRateSlope2())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const variableRateSlope2String = addDotToLastDigit(variableRateSlope2);

  const stableRateSlope1 = (await reserveStrategyContract.stableRateSlope1())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const stableRateSlope1String = addDotToLastDigit(stableRateSlope1);

  const stableRateSlope2 = (await reserveStrategyContract.stableRateSlope2())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const stableRateSlope2String = addDotToLastDigit(stableRateSlope2);

  console.log('Optimal utilization rate', utilizationRateString);

  console.log('Base variable borrow rate', baseVariableBorrowRateString);

  console.log('Variable rate slope 1', variableRateSlope1String);

  console.log('Variable rate slope 2', variableRateSlope2String);

  console.log('Stable borrow rate', stableBorrowRateString);

  console.log('Stable rate slope 1', stableRateSlope1String);

  console.log('Stable rate slope 2', stableRateSlope2String);
}
