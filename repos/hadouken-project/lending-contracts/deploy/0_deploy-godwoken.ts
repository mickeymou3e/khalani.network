import { DeployFunction } from 'hardhat-deploy/types';

import { deployAddressProviderCli } from '@cli/contracts/common/deploy/addressProvider';
import { deployCollateralManagerCli } from '@cli/contracts/common/deploy/collateralManager';
import { deployDataProviderCli } from '@cli/contracts/common/deploy/dataProvider';
import { deployInitializePoolCli } from '@cli/contracts/common/deploy/initialize';
import { deployLendingPoolCli } from '@cli/contracts/common/deploy/lendingPool';
import { deployLibrariesCli } from '@cli/contracts/common/deploy/libraries';
import { deployOracleCli } from '@cli/contracts/common/deploy/oracle';
import { deployPoolTokensCli } from '@cli/contracts/common/deploy/poolTokens';
import { deployRegistryCli } from '@cli/contracts/common/deploy/registry';
import { deployRegistryProviderCli } from '@cli/contracts/common/deploy/registryProvider';
import { deployTreasuryCli } from '@cli/contracts/common/deploy/treasury';
import { deployUiHelperCli } from '@cli/contracts/common/deploy/uiHelper';
import { deployUnderlyingTokensCli } from '@cli/contracts/common/deploy/underlyingTokens';
import { deployUserBalancesCli } from '@cli/contracts/common/deploy/userBalances';
import { setupScriptRunEnvironmentForHardhat } from '@cli/scriptRunEnvironment';
import { getConfigFromNetworkName } from '@src/filesManager';
import { Config, Environments } from '@src/types/types';
import { ethers } from 'hardhat';

const func: DeployFunction = async function (hre) {
  const { deployer } = await hre.getNamedAccounts();
  const config = getConfigFromNetworkName(
    hre.network.name as Environments,
    process.env.CLI_DEPLOYER
  );
  const deployerProvider = await ethers.getSigner(deployer);

  const environment = await setupScriptRunEnvironmentForHardhat(config as Config, deployerProvider);

  await deployTreasuryCli(environment);
  await deployUnderlyingTokensCli({ environment }, true);
  await deployRegistryCli(environment);
  await deployAddressProviderCli(environment);
  await deployLibrariesCli(environment);
  await deployLendingPoolCli(environment);
  await deployOracleCli(environment);
  await deployDataProviderCli(environment);
  await deployInitializePoolCli(environment);
  await deployCollateralManagerCli(environment);
  await deployRegistryProviderCli(environment);
  await deployPoolTokensCli(environment);
  await deployUserBalancesCli(environment);
  await deployUiHelperCli(environment);
};

func.tags = ['godwoken'];
export default func;
