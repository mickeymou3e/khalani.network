import prompts from 'prompts';

import { Cli } from '@src/types';

import { DEPLOY_CLI_COMMANDS } from '@cli/types';
import { writeToContractsConfig } from '@scripts/filesManager';
import { deployAddressProviderCli } from '../../common/deploy/addressProvider';

import { deployLendingPoolConfiguratorCli } from './configurator';
import { deployDataProviderCli } from './dataProvider';

import { deployLendingPoolCli } from './lendingPool';

import { deployLibrariesCli } from './libraries';
import { deployOracleCli } from './oracle';
import { deployRegistryCli } from './registry';
import { deployRegistryProviderCli } from './registryProvider';

import { getConfigInstant } from '@src/utils';
import { deployCollateralManagerCli } from './collateralManager';
import { deployInitializePoolCli } from './initialize';
import { deployPoolTokensCli } from './poolTokens';
import { deployTreasuryCli } from './treasury';
import { deployUiHelperCli } from './uiHelper';
import { deployUnderlyingTokensCli } from './underlyingTokens';
import { deployUserBalancesCli } from './userBalances';
import { deployWEthGatewayCli } from './wETHGateway';

export const DeployCli: Cli = async ({ environment, parentCli }) => {
  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select action',
      choices: [
        { title: DEPLOY_CLI_COMMANDS.treasury.toString(), value: DEPLOY_CLI_COMMANDS.treasury },
        { title: DEPLOY_CLI_COMMANDS.registry.toString(), value: DEPLOY_CLI_COMMANDS.registry },
        {
          title: DEPLOY_CLI_COMMANDS.addressProvider.toString(),
          value: DEPLOY_CLI_COMMANDS.addressProvider,
        },
        { title: DEPLOY_CLI_COMMANDS.libraries.toString(), value: DEPLOY_CLI_COMMANDS.libraries },
        {
          title: DEPLOY_CLI_COMMANDS.lendingPool.toString(),
          value: DEPLOY_CLI_COMMANDS.lendingPool,
        },
        { title: DEPLOY_CLI_COMMANDS.oracle.toString(), value: DEPLOY_CLI_COMMANDS.oracle },
        {
          title: DEPLOY_CLI_COMMANDS.underlyingTokens.toString(),
          value: DEPLOY_CLI_COMMANDS.underlyingTokens,
        },

        {
          title: DEPLOY_CLI_COMMANDS.dataProvider.toString(),
          value: DEPLOY_CLI_COMMANDS.dataProvider,
        },
        {
          title: DEPLOY_CLI_COMMANDS.initializePool.toString(),
          value: DEPLOY_CLI_COMMANDS.initializePool,
        },
        {
          title: DEPLOY_CLI_COMMANDS.collateralManager.toString(),
          value: DEPLOY_CLI_COMMANDS.collateralManager,
        },
        {
          title: DEPLOY_CLI_COMMANDS.registryProvider.toString(),
          value: DEPLOY_CLI_COMMANDS.registryProvider,
        },
        {
          title: DEPLOY_CLI_COMMANDS.poolTokens.toString(),
          value: DEPLOY_CLI_COMMANDS.poolTokens,
        },
        {
          title: DEPLOY_CLI_COMMANDS.userBalances.toString(),
          value: DEPLOY_CLI_COMMANDS.userBalances,
        },
        {
          title: DEPLOY_CLI_COMMANDS.wEthGateway.toString(),
          value: DEPLOY_CLI_COMMANDS.wEthGateway,
        },
        { title: DEPLOY_CLI_COMMANDS.uiHelper.toString(), value: DEPLOY_CLI_COMMANDS.uiHelper },
        {
          title: DEPLOY_CLI_COMMANDS.lendingPoolConfigurator.toString(),
          value: DEPLOY_CLI_COMMANDS.lendingPoolConfigurator,
        },
        { title: DEPLOY_CLI_COMMANDS.all, value: DEPLOY_CLI_COMMANDS.all },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  switch (action) {
    case DEPLOY_CLI_COMMANDS.treasury:
      await deployTreasuryCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.registry:
      await deployRegistryCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.addressProvider:
      await deployAddressProviderCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.libraries:
      await deployLibrariesCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.lendingPool:
      await deployLendingPoolCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.underlyingTokens:
      const { all } = await prompts({
        type: 'toggle',
        name: 'all',
        message: 'Should deploy all',
      });

      await deployUnderlyingTokensCli({ environment }, all);
      break;
    case DEPLOY_CLI_COMMANDS.oracle:
      await deployOracleCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.dataProvider:
      await deployDataProviderCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.initializePool:
      await deployInitializePoolCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.collateralManager:
      await deployCollateralManagerCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.registryProvider:
      await deployRegistryProviderCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.poolTokens:
      await deployPoolTokensCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.userBalances:
      await deployUserBalancesCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.uiHelper:
      await deployUiHelperCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.lendingPoolConfigurator:
      await deployLendingPoolConfiguratorCli(environment);
      break;
    case DEPLOY_CLI_COMMANDS.wEthGateway:
      const gatewayConfig = getConfigInstant(environment.chainId, environment.env, true);

      if (!gatewayConfig?.nativeToken.wrapAddress)
        throw Error('wrap token not defined for native token');
      await deployWEthGatewayCli(environment, gatewayConfig.nativeToken.wrapAddress);
      break;
    case DEPLOY_CLI_COMMANDS.all:
      const firstBlockNumber = await environment.deployer.provider?.getBlockNumber();
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

      const config = getConfigInstant(environment.chainId, environment.env, true);
      if (!config) throw Error('config not found');
      if (config.nativeToken.wrapAddress) {
        await deployWEthGatewayCli(environment, config.nativeToken.wrapAddress);
      }

      const lastBlockNumber = await environment.deployer.provider?.getBlockNumber();
      writeToContractsConfig(
        {
          firstBlockNumber,
          lastBlockNumber,
        },
        environment.chainId,
        environment.env,
        environment.networkName
      );
      break;
  }

  return DeployCli({ environment, parentCli });
};
