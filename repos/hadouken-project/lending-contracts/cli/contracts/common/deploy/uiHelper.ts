import { delay } from '@src/utils';

import { deployUiHelper } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployUiHelperCli = async (environment: ScriptRunEnvironment) => {
  console.log('deploying UI helper');
  const { delayInMs } = environment;

  const UIHelperAddress = await deployUiHelper(environment);

  await delay(delayInMs);

  console.log(`UI helper have been deployed at address: ${UIHelperAddress}`);

  return UIHelperAddress;
};
