import { BigNumber } from '@ethersproject/bignumber';

import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';

import { connectToContractsRuntime } from '@scripts/connect';

export async function borrow(
  environment: ScriptRunEnvironment,
  tokenSymbol: string,
  tokenAmount: BigNumber,
  borrowType: number
) {
  const config = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) return null;

  const ercSelector = connectToContractsRuntime(environment).token;
  const tokenContract = ercSelector(config.tokens[tokenSymbol].address);

  const pool = connectToContractsRuntime(environment).pool;
  if (!pool) throw Error('pool not defined');

  try {
    const borrowTransaction = await pool.borrow(
      tokenContract.address,
      tokenAmount,
      borrowType,
      0,
      environment.address,
      environment.transactionOverrides
    );

    await borrowTransaction.wait();

    console.log('Borrow completed');
  } catch (e) {
    console.log('error', e);
  }
}
