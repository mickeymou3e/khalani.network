import { BigNumber } from 'ethers';

import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';

export async function mint(
  environment: ScriptRunEnvironment,
  tokenSymbol: string,
  tokenAmount: BigNumber,
  logs: boolean = true
) {
  const config = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!config) return BigNumber.from(0);

  try {
    const amount = BigNumber.from(tokenAmount);

    const ercSelector = connectToContractsRuntime(environment).mintToken;
    const token = ercSelector(config.tokens[tokenSymbol].address);
    const symbol = await token.symbol();

    if (logs) {
      console.log(`Minting ${symbol} in amount ${tokenAmount} for account ${environment.address}`);
      console.log(
        `User Balances ${symbol}:(Before) ${await token.balanceOf(
          environment.address,
          environment.transactionOverrides
        )}`
      );
    }

    await (await token.mint(environment.address, amount, environment.transactionOverrides)).wait();

    const balance = await token.balanceOf(environment.address, environment.transactionOverrides);

    if (logs) {
      console.log(`User Balances ${symbol}:(After) ${balance}`);
    }
    return balance;
  } catch (e) {
    console.log('error', e);
    return BigNumber.from(0);
  }
}
