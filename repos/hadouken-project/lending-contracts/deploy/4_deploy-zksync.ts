import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Environments, getConfigFromNetworkName } from '../src';

import { deployAddressProviderCli } from '@cli/contracts/common/deploy/addressProvider';
import { deployCollateralManagerCli } from '@cli/contracts/common/deploy/collateralManager';
import { deployDataProviderCli } from '@cli/contracts/common/deploy/dataProvider';
import { deployInitializePoolCli } from '@cli/contracts/common/deploy/initialize';
import { deployLendingPoolCli } from '@cli/contracts/common/deploy/lendingPool';
import { deployOracleCli } from '@cli/contracts/common/deploy/oracle';
import { deployRegistryCli } from '@cli/contracts/common/deploy/registry';
import { deployRegistryProviderCli } from '@cli/contracts/common/deploy/registryProvider';
import { deployTreasuryCli } from '@cli/contracts/common/deploy/treasury';
import { deployUiHelperCli } from '@cli/contracts/common/deploy/uiHelper';
import { deployUnderlyingTokensCli } from '@cli/contracts/common/deploy/underlyingTokens';
import { deployUserBalancesCli } from '@cli/contracts/common/deploy/userBalances';
import { setupZkSyncDeploymentEnvironment } from '@cli/contracts/zkSync/helpers';
import { deployWEthGateway } from '@scripts/deploy';
import { updateZkSyncLendingTokensConfig } from '@scripts/deploy/zkSync/tokens/lendingTokens';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ScriptRunEnvironment, ZkSyncDeploymentEnvironment } from '@src/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const config = getConfigFromNetworkName(
    hre.network.name as Environments,
    process.env.CLI_DEPLOYER
  );

  const environment = setupZkSyncDeploymentEnvironment(config, hre);

  const firstBlockNumber = await environment.walletWithProvider.provider.getBlockNumber();

  writeToContractsConfig(
    {
      firstBlockNumber,
    },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  const env = environment as unknown as ScriptRunEnvironment;

  await deployTreasuryCli(env);
  await deployUnderlyingTokensCli({ environment: env }, true);
  await deployRegistryCli(env);
  await deployAddressProviderCli(env);
  await deployLendingPoolCli(env);
  await deployOracleCli(env);
  await deployDataProviderCli(env);
  await deployInitializePoolCli(env);
  await deployCollateralManagerCli(env);
  await deployRegistryProviderCli(env);
  await deployUserBalancesCli(env);
  await deployUiHelperCli(env);

  await updateZkSyncLendingTokensConfig(env as unknown as ZkSyncDeploymentEnvironment);

  await deployWEthGateway(
    env as unknown as ZkSyncDeploymentEnvironment,
    config.nativeToken.wrapAddress ?? ''
  );

  const lastBlockNumber = await environment.walletWithProvider.provider.getBlockNumber();

  writeToContractsConfig(
    {
      lastBlockNumber,
    },
    environment.chainId,
    environment.env,
    environment.networkName
  );
};

func.tags = ['zkSync'];
export default func;
