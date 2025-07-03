import { BigNumber } from '@ethersproject/bignumber';

import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';

import { connectToContractsRuntime } from '@scripts/connect';

export async function withdraw(
  environment: ScriptRunEnvironment,
  tokenSymbol: string,
  tokenAmount: BigNumber
) {
  const config = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) return null;

  const amount = tokenAmount;

  const symbol = tokenSymbol;

  const ercSelector = connectToContractsRuntime(environment).token;
  const token = ercSelector(config.tokens[symbol].address);

  const pool = connectToContractsRuntime(environment).pool;
  if (!pool) throw Error('pool not defined');

  const reserveData = await pool.getReserveData(token.address);

  try {
    console.log(
      `Withdrawing tokens ${symbol} in amount ${tokenAmount} for account ${environment.address}`
    );
    console.log(`
    Balance before
    `);
    console.log(`${symbol} Balance ${symbol}: ${await token.balanceOf(environment.address)}`);
    console.log(
      `A${symbol} Balance ${symbol}: ${await token.balanceOf(reserveData.aTokenAddress)}`
    );

    const withdrawTransaction = await pool.withdraw(
      token.address,
      amount,
      environment.address,
      environment.transactionOverrides
    );

    await withdrawTransaction.wait();

    console.log(`
    Balance after
    `);
    console.log(`${symbol} Balance ${symbol}: ${await token.balanceOf(environment.address)}`);
    console.log(
      `A${symbol} Balance ${symbol}: ${await token.balanceOf(reserveData.aTokenAddress)}`
    );
    console.log(' ');
    console.log('Withdraw completed');
  } catch (e) {
    console.log('error', e);
  }
}
