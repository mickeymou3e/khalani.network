import { BigNumber } from '@ethersproject/bignumber';

import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';

export async function deposit(
  environment: ScriptRunEnvironment,
  tokenSymbol: string,
  tokenAmount: BigNumber
) {
  const config = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) return null;

  const amount = BigNumber.from(tokenAmount);

  const ercSelector = connectToContractsRuntime(environment).token;
  const token = ercSelector(config.tokens[tokenSymbol].address);

  const symbol = await token.symbol();

  const pool = connectToContractsRuntime(environment).pool;
  if (!pool) throw Error('pool not defined');

  const reserveData = await pool.getReserveData(token.address);

  try {
    console.log(
      `Deposit token ${symbol} in amount ${tokenAmount} for account ${environment.address}`
    );
    console.log(`
    Balance before
    `);
    console.log(`${symbol} Balance: ${await token.balanceOf(environment.address)}`);
    console.log(`A${symbol} Balance: ${await token.balanceOf(reserveData.aTokenAddress)}`);

    await (await token.approve(pool.address, amount)).wait();

    const depositTransaction = await pool.deposit(
      token.address,
      amount,
      environment.address,
      0,
      environment.transactionOverrides
    );

    await depositTransaction.wait();
    console.log(`
    Balance after
    `);
    const newBalance = await token.balanceOf(environment.address);
    console.log(`${symbol} Balance: ${await token.balanceOf(environment.address)}`);
    console.log(`A${symbol} Balance: ${await token.balanceOf(reserveData.aTokenAddress)}`);
    console.log(' ');
    console.log('Deposit completed');
    return newBalance;
  } catch (e) {
    console.log('error', e);
    return BigNumber.from(0);
  }
}
