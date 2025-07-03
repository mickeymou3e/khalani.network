import { getContractsConfigInstant, waitForTx } from '@src/utils';

import { connectToContractsRuntime } from '@scripts/connect';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';

export const deployBaseRegistryProvider = async (environment: ScriptRunEnvironment) => {
  const { chainId, env, networkName } = environment;
  const config = getContractsConfigInstant(chainId, env, true);

  const addressProviderAddress = config?.addressProvider;
  if (!addressProviderAddress) {
    console.log('Address provider has not been initialized! Aborting deployment of data provider.');
    return;
  }
  const providerId = 2;
  const registryProvider = connectToContractsRuntime(environment).registry;
  if (!registryProvider) throw Error('registryProvider not found');

  const res = await registryProvider.registerAddressesProvider(
    addressProviderAddress,
    providerId,
    environment.transactionOverrides
  );

  await await waitForTx(res);

  writeToContractsConfig({ registryProvider: registryProvider.address }, chainId, env, networkName);

  console.log(`Registry provider has been deployed at address: ${registryProvider.address}`);
  return registryProvider.address;
};
