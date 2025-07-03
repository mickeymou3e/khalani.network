import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import { Environments, getConfigFromNetworkName } from '../src';

import { setupZkSyncDeploymentEnvironment } from '@cli/contracts/zkSync/helpers';
import { deployZkSyncReserveLogicLibrary } from '@scripts/deploy/zkSync/libraries';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const config = getConfigFromNetworkName(
    hre.network.name as Environments,
    process.env.CLI_DEPLOYER
  );

  const environment = setupZkSyncDeploymentEnvironment(config, hre);
  const env = environment as unknown as ZkSyncDeploymentEnvironment;

  const reserveLibrary = await deployZkSyncReserveLogicLibrary(env);

  const librariesAddress = {
    reserve: reserveLibrary,
    generic: '',
    validation: '',
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
