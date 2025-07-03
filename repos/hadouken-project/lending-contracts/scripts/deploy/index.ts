import { LendingPoolLibraries, PoolTokens } from '@scripts/types';
import { isZkSyncNetwork } from '@src/network';
import { ScriptRunEnvironment, ZkSyncDeploymentEnvironment } from '@src/types';

import * as BaseDeploy from './base';
import * as ZkSyncDeploy from './zkSync';

export const deployAddressProvider = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment,
  marketId: string
): Promise<string> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncAddressProvider(
      environment as ZkSyncDeploymentEnvironment,
      marketId
    );
  } else {
    return await BaseDeploy.deployBaseAddressProvider(
      environment as ScriptRunEnvironment,
      marketId
    );
  }
};

export const deployCollateralManager = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
): Promise<string> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncCollateralManager(
      environment as ZkSyncDeploymentEnvironment
    );
  } else {
    return await BaseDeploy.deployBaseCollateralManager(environment as ScriptRunEnvironment);
  }
};

export const deployDataProvider = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
): Promise<string> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncDataProvider(environment as ZkSyncDeploymentEnvironment);
  } else {
    return await BaseDeploy.deployBaseDataProvider(environment as ScriptRunEnvironment);
  }
};

export const deployLendingPool = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment,
  redeployImplementation: boolean
): Promise<string> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncLendingPool(
      environment as ZkSyncDeploymentEnvironment,
      redeployImplementation
    );
  } else {
    return await BaseDeploy.deployBaseLendingPool(
      environment as ScriptRunEnvironment,
      redeployImplementation
    );
  }
};

export const deployLendingPoolConfigurator = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
): Promise<string> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncConfigurator(environment as ZkSyncDeploymentEnvironment);
  } else {
    return await BaseDeploy.deployBaseConfigurator(environment as ScriptRunEnvironment);
  }
};

export const deployLibraries = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
): Promise<LendingPoolLibraries> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncLibraries(environment as ZkSyncDeploymentEnvironment);
  } else {
    return await BaseDeploy.deployBaseLibraries(environment as ScriptRunEnvironment);
  }
};

export const deployOracle = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
) => {
  if (isZkSyncNetwork(environment.chainId)) {
    await ZkSyncDeploy.deployZkSyncOracle(environment as ZkSyncDeploymentEnvironment);
  } else {
    await BaseDeploy.deployBasePriceOracle(environment as ScriptRunEnvironment);
  }
};

export const deployTreasury = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
): Promise<string> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncTreasury(environment as ZkSyncDeploymentEnvironment);
  } else {
    const res = await BaseDeploy.deployBaseTreasury(environment as ScriptRunEnvironment);
    return res.treasuryAddress;
  }
};

export const deployRegistry = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
): Promise<string> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncRegistry(environment as ZkSyncDeploymentEnvironment);
  } else {
    return await BaseDeploy.deployBaseRegistry(environment as ScriptRunEnvironment);
  }
};

export const deployUiHelper = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
): Promise<string> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncUIHelper(environment as ZkSyncDeploymentEnvironment);
  } else {
    return await BaseDeploy.deployBaseUIHelper(environment as ScriptRunEnvironment);
  }
};

export const deployUserBalances = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
): Promise<string> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncUserBalances(environment as ZkSyncDeploymentEnvironment);
  } else {
    return await BaseDeploy.deployBaseUserBalances(environment as ScriptRunEnvironment);
  }
};

export const deployPoolTokens = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
): Promise<PoolTokens> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncPoolTokens(environment as ZkSyncDeploymentEnvironment);
  } else {
    return await BaseDeploy.deployBasePoolTokens(environment as ScriptRunEnvironment);
  }
};

export const deployRateStrategy = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment,
  args: [string, string, string, string, string, string, string]
): Promise<string> => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncRateStrategy(
      environment as ZkSyncDeploymentEnvironment,
      args
    );
  } else {
    return await BaseDeploy.deployBaseRateStrategy(environment as ScriptRunEnvironment, args);
  }
};

export const deployInitialize = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
) => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncInitialization(
      environment as ZkSyncDeploymentEnvironment
    );
  } else {
    return await BaseDeploy.deployBaseInitialization(environment as ScriptRunEnvironment);
  }
};

export const deploySingleTestToken = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment,
  mintAddress: string,
  name: string,
  symbol: string,
  initialAmount: any,
  decimals: number
) => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncSingleTestToken(
      environment as ZkSyncDeploymentEnvironment,
      mintAddress,
      name,
      symbol,
      initialAmount,
      decimals
    );
  } else {
    return await BaseDeploy.deployBaseSingleToken(
      environment as ScriptRunEnvironment,
      mintAddress,
      name,
      symbol,
      initialAmount,
      decimals
    );
  }
};

export const deployTestTokens = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
) => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncTestTokens(environment as ZkSyncDeploymentEnvironment);
  } else {
    return await BaseDeploy.deployBaseTestTokens(environment as ScriptRunEnvironment);
  }
};

export const deployRegisterProvider = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
) => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncRegistryProvider(
      environment as ZkSyncDeploymentEnvironment
    );
  } else {
    return await BaseDeploy.deployBaseRegistryProvider(environment as ScriptRunEnvironment);
  }
};

export const deployWEthGateway = async (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment,
  wEth: string
) => {
  if (isZkSyncNetwork(environment.chainId)) {
    return await ZkSyncDeploy.deployZkSyncWEthGateway(
      environment as ZkSyncDeploymentEnvironment,
      wEth
    );
  } else {
    return await BaseDeploy.deployBaseWEthGateway(environment as ScriptRunEnvironment, wEth);
  }
};
