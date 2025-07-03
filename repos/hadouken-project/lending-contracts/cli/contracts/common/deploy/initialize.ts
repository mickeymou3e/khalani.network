import { delay } from '@src/utils';

import { deployInitialize } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployInitializePoolCli = async (environment: ScriptRunEnvironment) => {
  console.log('deploying strategies');
  const strategies = await deployInitialize(environment);

  console.log('strategies deployed', strategies);

  await delay(environment.delayInMs);
};
