import { writeToContractsConfig } from '@scripts/filesManager';

import { deployLendingPool } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployLendingPoolCli = async (environment: ScriptRunEnvironment) => {
  const { chainId, env, networkName } = environment;

  const lendingPoolAddress = await deployLendingPool(environment, false);

  writeToContractsConfig({ lendingPool: lendingPoolAddress }, chainId, env, networkName);

  return lendingPoolAddress;
};
