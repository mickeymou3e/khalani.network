import { BigNumber } from '@ethersproject/bignumber';

import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';

export async function repay(
  environment: ScriptRunEnvironment,
  tokenSymbol: string,
  tokenAmount: BigNumber,
  borrowType: number
) {
  const env = 'local';
  const chainId = '0x';

  const config = getContractsConfigInstant(chainId, environment.env);
  if (!config) return null;

  const symbol = tokenSymbol;

  const ercSelector = connectToContractsRuntime(environment).token;
  const tokenContract = ercSelector(config.tokens[symbol].address);

  const token = ercSelector(config.tokens[tokenSymbol].address);
  const pool = connectToContractsRuntime(environment).pool;
  if (!pool) throw Error('pool not found');

  const reserveData = await pool.getReserveData(config.tokens[symbol].address);

  try {
    await (await token.approve(pool.address, tokenAmount)).wait();

    const repayTransaction = await pool.repay(
      tokenContract.address,
      tokenAmount,
      borrowType,
      environment.address,
      environment.transactionOverrides
    );

    await repayTransaction.wait();

    console.log('Repay completed');
  } catch (e) {
    console.log('error', e);
  }
}
