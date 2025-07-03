import { writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { LendingContracts } from '@src/utils';

export async function deployZkSyncRegistry(environment: ZkSyncDeploymentEnvironment) {
  console.log('Deploying registry');
  const { deployer, chainId, env, networkName } = environment;

  const registryArtifact = await deployer.loadArtifact(LendingContracts.Registry);

  const registry = await deployer.deploy(registryArtifact);

  console.log(`Registry deploy: ${registry.address}`);

  writeToContractsConfig({ registry: registry.address }, chainId, env, networkName);

  return registry.address;
}
