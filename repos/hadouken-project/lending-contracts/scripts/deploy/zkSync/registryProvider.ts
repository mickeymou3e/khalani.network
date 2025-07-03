import { connectToContractsRuntime } from '@scripts/connect';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { getContractsConfigInstant, waitForTx } from '@src/utils';

export const deployZkSyncRegistryProvider = async (
  zksyncDeploymentEnvironment: ZkSyncDeploymentEnvironment
) => {
  const { env, chainId, networkName } = zksyncDeploymentEnvironment;

  const config = getContractsConfigInstant(chainId, env, true);
  const contracts = connectToContractsRuntime(zksyncDeploymentEnvironment);

  const addressProviderAddress = config?.addressProvider;
  if (!addressProviderAddress) {
    console.log('Address provider has not been initialized! Aborting deployment of data provider.');
    return;
  }
  const providerId = 2;

  const registryProvider = contracts.registry;
  if (!registryProvider) throw Error('registryProvider not found');

  const res = await registryProvider.registerAddressesProvider(addressProviderAddress, providerId);

  await waitForTx(res);

  writeToContractsConfig({ registryProvider: registryProvider.address }, chainId, env, networkName);

  console.log(`Registry provider has been deployed at address: ${registryProvider.address}`);
};
