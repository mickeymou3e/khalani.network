import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';
import { BigNumber } from 'ethers';

export async function changeOraclePrice(
  environment: ScriptRunEnvironment,
  tokenSymbol: string,
  price: BigNumber
) {
  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);

  if (!contractsConfig) return null;

  const stdReference = connectToContractsRuntime(environment).stdReference;
  if (!stdReference) throw Error('stdReference not found');

  try {
    await (await stdReference.updatePriceUSD(tokenSymbol.toUpperCase(), price)).wait();

    console.log(`(${tokenSymbol}) new price is (10^9) ${price}`);
  } catch (e) {
    console.log('error', e);
  }
}

export async function changeOraclePriceTest(
  environment: ScriptRunEnvironment,
  tokenSymbol: string,
  price: BigNumber
) {
  const stdReference = connectToContractsRuntime(environment).stdReference;
  if (!stdReference) throw Error('stdReference not found');

  try {
    await (await stdReference.updatePriceUSD(tokenSymbol.toUpperCase(), price)).wait();

    console.log(`(${tokenSymbol}) new price is (10^9) ${price}`);
  } catch (e) {
    console.log('error', e);
  }
}
