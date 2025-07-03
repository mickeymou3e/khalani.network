import { deployOracle } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployOracleCli = async (environment: ScriptRunEnvironment) => {
  console.log('Deploying oracle');
  await deployOracle(environment);
  console.log('Deploying oracle done');
};
