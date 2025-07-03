import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { Environments, getConfigFromNetworkName, getContractsConfigFromNetworkName } from '../src';

import { setupZkSyncDeploymentEnvironment } from '@cli/contracts/zkSync/helpers';
import { deployZkSyncValidationLogicLibrary } from '@scripts/deploy/zkSync/libraries';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const config = getConfigFromNetworkName(
    hre.network.name as Environments,
    process.env.CLI_DEPLOYER
  );

  const environment = setupZkSyncDeploymentEnvironment(config, hre);
  const env = environment as unknown as ZkSyncDeploymentEnvironment;

  const validationLibrary = await deployZkSyncValidationLogicLibrary(env);

  const contractsConfig = getContractsConfigFromNetworkName(env.networkName);

  const librariesAddress = {
    reserve: contractsConfig.libraries.reserve,
    generic: contractsConfig.libraries.generic,
    validation: validationLibrary,
  };

  writeToContractsConfig(
    { libraries: librariesAddress },
    environment.chainId,
    environment.env,
    environment.networkName
  );
};

func.tags = ['zkSync'];

export default func;
