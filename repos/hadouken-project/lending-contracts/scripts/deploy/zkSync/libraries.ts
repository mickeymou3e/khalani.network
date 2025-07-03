import { writeToContractsConfig } from '@scripts/filesManager';
import { LendingPoolLibraries } from '@scripts/types';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { LendingContracts } from '@src/utils';

export async function deployZkSyncLibraries(
  environment: ZkSyncDeploymentEnvironment
): Promise<LendingPoolLibraries> {
  console.log('Deploying libraries');

  const reserveLibrary = await deployZkSyncReserveLogicLibrary(environment);
  const genericLibrary = await deployZkSyncGenericLogicLibrary(environment);
  const validationLibrary = await deployZkSyncValidationLogicLibrary(environment);

  const librariesAddress = {
    reserve: reserveLibrary,
    generic: genericLibrary,
    validation: validationLibrary,
  };

  writeToContractsConfig(
    { libraries: librariesAddress },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  return librariesAddress;
}

export const deployZkSyncReserveLogicLibrary = async (environment: ZkSyncDeploymentEnvironment) => {
  console.log('Deploying Reserve Logic Library');
  const { deployer } = environment;

  const artifact = await deployer.loadArtifact(LendingContracts.LibraryReserveLogic);

  const contract = await deployer.deploy(artifact);

  console.log(`Reserve Logic Library ${contract.address}`);
  return contract.address;
};

export const deployZkSyncGenericLogicLibrary = async (environment: ZkSyncDeploymentEnvironment) => {
  console.log('Deploying Generic Logic Library');
  const { deployer } = environment;

  const artifact = await deployer.loadArtifact(LendingContracts.LibraryGenericLogic);

  const contract = await deployer.deploy(artifact);

  console.log(`Generic logic Library ${contract.address}`);
  return contract.address;
};

export const deployZkSyncValidationLogicLibrary = async (
  environment: ZkSyncDeploymentEnvironment
) => {
  console.log('Deploying Validation Logic Library');
  const { deployer } = environment;

  const validationLogicFactory = await deployer.loadArtifact(
    LendingContracts.LibraryValidationLogic
  );

  const contract = await deployer.deploy(validationLogicFactory);

  console.log(`Validation Logic Library Deployed ${contract.address}`);
  return contract.address;
};
