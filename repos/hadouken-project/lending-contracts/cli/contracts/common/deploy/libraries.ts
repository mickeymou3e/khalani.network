import { delay } from '@src/utils';

import { deployLibraries } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployLibrariesCli = async (environment: ScriptRunEnvironment) => {
  await deployLibraries(environment);

  await delay(environment.delayInMs);

  console.log(`Libraries have been deployed`);
};
