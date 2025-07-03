import { connectToContractsRuntime } from '@scripts/connect';
import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';
import { BigNumber } from 'ethers';

export async function balanceOf(
  environment: ScriptRunEnvironment,
  tokenSymbol: string,
  logs: boolean = true
) {
  const { deployer, env, chainId } = environment;
  const config = getContractsConfigInstant(chainId, env, true);
  if (!config) return null;

  try {
    const ercSelector = connectToContractsRuntime(environment).token;
    const token = ercSelector(config.tokens[tokenSymbol].address);
    const symbol = await token.symbol();
    const balance = await token.balanceOf(deployer.address);

    if (logs) {
      console.log(`${deployer.address} User Balances ${symbol}: ${balance}`);
    }

    return balance;
  } catch (e) {
    console.log('error', e);
    return BigNumber.from(0);
  }
}
