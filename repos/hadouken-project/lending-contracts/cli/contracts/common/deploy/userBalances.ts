import { delay } from '@src/utils';

import { deployUserBalances } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployUserBalancesCli = async (environment: ScriptRunEnvironment) => {
  console.log('deploying user balances cli');
  const { delayInMs } = environment;

  const userBalancesAddress = await deployUserBalances(environment);

  await delay(delayInMs);
  console.log(`User Balances have been deployed at address: ${userBalancesAddress}`);
  return userBalancesAddress;
};
