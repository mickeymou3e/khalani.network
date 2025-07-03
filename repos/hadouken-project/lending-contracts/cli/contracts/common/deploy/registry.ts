import { delay } from '@src/utils';

import { deployRegistry } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployRegistryCli = async (environment: ScriptRunEnvironment) => {
  const { delayInMs } = environment;

  const registry = await deployRegistry(environment);

  await delay(delayInMs);

  console.log(`Registry have been deployed at address: ${registry}`);
  return registry;
};
