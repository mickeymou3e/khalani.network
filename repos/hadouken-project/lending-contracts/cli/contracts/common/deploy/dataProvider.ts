import { writeToContractsConfig } from '@scripts/filesManager';
import { delay, getConfigInstant } from '@src/utils';

import { deployDataProvider } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployDataProviderCli = async (environment: ScriptRunEnvironment) => {
  const config = getConfigInstant(environment.chainId, environment.env);
  if (!config) throw Error('config not found');

  const delayTime = Number(config.delay);

  const dataProviderAddress = await deployDataProvider(environment);

  await delay(delayTime);
  writeToContractsConfig(
    {
      dataProvider: dataProviderAddress,
    },
    environment.chainId,
    environment.env,
    environment.networkName
  );
  console.log(`Data provider has been deployed at address: ${dataProviderAddress}`);
  return dataProviderAddress;
};
