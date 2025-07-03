import { amountSelectorCli } from '@cli/commands/prompt';
import { addDotToLastDigit, convertTextNumberToBigNumberStringWithDecimals } from '@cli/utils';
import { connectToContractsRuntime } from '@scripts/connect';
import { deployRateStrategy } from '@scripts/deploy';

import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';
import { BigNumber } from 'ethers';

export async function setInterestRateStrategy(
  environment: ScriptRunEnvironment,
  token: { address: string; symbol: string }
) {
  const ray = 27;
  const percentage = 2;
  const decimals = ray - percentage;

  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!contractsConfig) throw Error('contractsConfig not found');
  const lendingPool = connectToContractsRuntime(environment).pool;
  const lendingRateOracle = connectToContractsRuntime(environment).lendingRateOracle;

  if (!lendingPool) throw Error('Lending pool not found');
  if (!lendingRateOracle) throw Error('lending rate oracle not found');

  const reserveData = await lendingPool.getReserveData(token.address, { gasPrice: 0 });

  const reserveStrategyContract = connectToContractsRuntime(environment).rateStrategy(
    reserveData.interestRateStrategyAddress
  );

  const utilizationRate = (await reserveStrategyContract.OPTIMAL_UTILIZATION_RATE())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const utilizationRateString = addDotToLastDigit(utilizationRate);

  const UParam = await amountSelectorCli(
    `Optimal utilization rate (current - ${utilizationRateString})`
  );

  if (!UParam) throw Error('UParam is null');

  const baseVariableBorrowRate = (await reserveStrategyContract.baseVariableBorrowRate())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const baseVariableBorrowRateString = addDotToLastDigit(baseVariableBorrowRate);

  const baseVariableRate = await amountSelectorCli(
    `Base Variable Borrow Rate: (current - ${baseVariableBorrowRateString})`
  );

  if (!baseVariableRate) throw Error('baseVariableRate is null');

  const variableRateSlope1 = (await reserveStrategyContract.variableRateSlope1())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const variableRateSlope1String = addDotToLastDigit(variableRateSlope1);

  const VRS1 = await amountSelectorCli(
    `Variable rate slope 1: (current - ${variableRateSlope1String})`
  );

  if (!VRS1) throw Error('VRS1 is null');

  const variableRateSlope2 = (await reserveStrategyContract.variableRateSlope2())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const variableRateSlope2String = addDotToLastDigit(variableRateSlope2);

  const VRS2 = await amountSelectorCli(
    `Variable rate slope 2: (current - ${variableRateSlope2String})`
  );

  if (!VRS2) throw Error('VRS2 is null');

  const stableBorrowRate = (await lendingRateOracle.getMarketBorrowRate(token.address))
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const stableBorrowRateString = addDotToLastDigit(stableBorrowRate);

  const BaseStableRate = await amountSelectorCli(
    `Base Stable Borrow Rate: (current - ${stableBorrowRateString})`
  );

  if (!BaseStableRate) throw Error('BaseStableRate is null');

  const stableRateSlope1 = (await reserveStrategyContract.stableRateSlope1())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const stableRateSlope1String = addDotToLastDigit(stableRateSlope1);

  const SRS1 = await amountSelectorCli(
    `Stable Rate Slope 1: (current - ${stableRateSlope1String})`
  );

  if (!SRS1) throw Error('SRS1 is null');

  const stableRateSlope2 = (await reserveStrategyContract.stableRateSlope2())
    .div(BigNumber.from(10).pow(decimals - 1))
    .toString();

  const stableRateSlope2String = addDotToLastDigit(stableRateSlope2);

  const SRS2 = await amountSelectorCli(
    `Stable Rate Slope 2: (current - ${stableRateSlope2String})`
  );

  if (!SRS2) throw Error('SRS2 is null');

  const uParamResult = convertTextNumberToBigNumberStringWithDecimals(UParam.toString());
  const u = BigNumber.from(uParamResult.value).mul(
    BigNumber.from(10).pow(decimals - uParamResult.decimals)
  );

  const variableRateResult = convertTextNumberToBigNumberStringWithDecimals(
    baseVariableRate.toString()
  );
  const variableRate = BigNumber.from(variableRateResult.value).mul(
    BigNumber.from(10).pow(decimals - variableRateResult.decimals)
  );

  const vr1Result = convertTextNumberToBigNumberStringWithDecimals(VRS1.toString());
  const vr1 = BigNumber.from(vr1Result.value).mul(
    BigNumber.from(10).pow(decimals - vr1Result.decimals)
  );

  const vr2Result = convertTextNumberToBigNumberStringWithDecimals(VRS2.toString());
  const vr2 = BigNumber.from(vr2Result.value).mul(
    BigNumber.from(10).pow(decimals - vr2Result.decimals)
  );

  const sr1Result = convertTextNumberToBigNumberStringWithDecimals(SRS1.toString());
  const sr1 = BigNumber.from(sr1Result.value).mul(
    BigNumber.from(10).pow(decimals - sr1Result.decimals)
  );

  const sr2Result = convertTextNumberToBigNumberStringWithDecimals(SRS2.toString());
  const sr2 = BigNumber.from(sr2Result.value).mul(
    BigNumber.from(10).pow(decimals - sr2Result.decimals)
  );

  const baseStableRateResult = convertTextNumberToBigNumberStringWithDecimals(
    BaseStableRate.toString()
  );

  const baseStableRate = BigNumber.from(baseStableRateResult.value).mul(
    BigNumber.from(10).pow(decimals - baseStableRateResult.decimals)
  );

  const newStrategy = await deployRateStrategy(environment, [
    contractsConfig.addressProvider,
    u.toString(),
    variableRate.toString(),
    vr1.toString(),
    vr2.toString(),
    sr1.toString(),
    sr2.toString(),
  ]);

  const poolConfig = connectToContractsRuntime(environment).poolConfiguration;
  if (!poolConfig) throw Error('poolConfig not found');

  const tx = await poolConfig.setReserveInterestRateStrategyAddress(
    token.address,
    newStrategy,
    environment.transactionOverrides
  );

  await tx.wait();

  await (
    await lendingRateOracle.setMarketBorrowRate(token.address, baseStableRate.toString())
  ).wait();
}
