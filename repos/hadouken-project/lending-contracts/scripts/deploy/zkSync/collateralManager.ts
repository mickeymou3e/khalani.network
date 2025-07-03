import { connectToContractsRuntime } from '@scripts/connect';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import {
  LendingContracts,
  delay,
  getConfigInstant,
  getContractsConfigInstant,
  waitForTx,
} from '@src/utils';

export const deployZkSyncCollateralManager = async (
  environment: ZkSyncDeploymentEnvironment
): Promise<string> => {
  const { env, chainId, walletWithProvider, deployer } = environment;

  const contractsConfig = getContractsConfigInstant(chainId, env, true);
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const delayTime = Number(config.delay);

  const dataProviderAddress = contractsConfig?.dataProvider;

  if (!dataProviderAddress) {
    throw Error('Data provider has not been deployed! Aborting deployment of collateral manager.');
  }

  const addressProviderContract = connectToContractsRuntime(environment).addressProvider;
  if (!addressProviderContract) throw Error('addressProviderContract not found');

  console.log('Deploying Collateral Manager');

  const collateralManagerFactory = await deployer.loadArtifact(LendingContracts.CollateralManager);

  const collateralManagerContract = await deployer.deploy(collateralManagerFactory);

  const collateralManagerAddress = collateralManagerContract.address;

  console.log(`Collateral Manager deployed: ${collateralManagerContract.address}`);

  await delay(delayTime);

  console.log(
    `Setting lending pool collateral manager implementation with address: ${collateralManagerAddress}`
  );

  await waitForTx(
    await addressProviderContract.setLendingPoolCollateralManager(collateralManagerAddress)
  );

  console.log('Setting lending pool collateral manager implementation Completed');

  console.log('Setting AaveProtocolDataProvider at AddressesProvider at id: 0x01');

  await waitForTx(
    await addressProviderContract.setAddress(
      '0x0100000000000000000000000000000000000000000000000000000000000000',
      dataProviderAddress
    )
  );

  writeToContractsConfig(
    {
      collateralManager: collateralManagerAddress,
    },
    environment.chainId,
    environment.env,
    environment.networkName
  );
  await delay(delayTime);

  return collateralManagerAddress;
};
