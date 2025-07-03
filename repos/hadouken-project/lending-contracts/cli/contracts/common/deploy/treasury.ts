import { delay } from '@src/utils';

import { deployTreasury } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployTreasuryCli = async (environment: ScriptRunEnvironment) => {
  const treasuryAddress = await deployTreasury(environment);

  await delay(environment.delayInMs);
  console.log(`Treasury have been deployed at address: ${treasuryAddress}`);
  return treasuryAddress;
};
