import { writeToContractsConfig } from '@scripts/filesManager';
import { delay, getConfigInstant, getContractsConfigInstant, waitForTx } from '@src/utils';

import { connectToContractsRuntime } from '@scripts/connect';
import { deployCollateralManager } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployCollateralManagerCli = async (environment: ScriptRunEnvironment) => {
  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);
  const config = getConfigInstant(environment.chainId, environment.env, true);
  if (!config) throw Error('config not found');
  const delayTime = Number(config.delay);
  const addressProviderAddress = contractsConfig?.addressProvider;
  const dataProviderAddress = contractsConfig?.dataProvider;

  if (!addressProviderAddress) {
    console.log(
      'Address provider has not been initialized! Aborting deployment of collateral manager.'
    );
    return;
  }

  if (!dataProviderAddress) {
    console.log('data provider has not been deployed! Aborting deployment of collateral manager.');
    return;
  }

  const addressProviderContract = connectToContractsRuntime(environment).addressProvider;

  if (!addressProviderContract) throw Error('addressProviderContract not found');

  const collateralManagerAddress = await deployCollateralManager(environment);
  await delay(delayTime);

  console.log(
    `Setting lending pool collateral manager implementation with address: ${collateralManagerAddress}`
  );

  const setCollateralManagerGasLimit =
    addressProviderContract.estimateGas.setLendingPoolCollateralManager(collateralManagerAddress);

  await waitForTx(
    await addressProviderContract.setLendingPoolCollateralManager(collateralManagerAddress, {
      gasPrice: config.gasPrice,
      gasLimit: setCollateralManagerGasLimit,
    })
  );

  console.log('Setting lending pool collateral manager implementation Completed');

  console.log('Setting AaveProtocolDataProvider at AddressesProvider at id: 0x01');

  await waitForTx(
    await addressProviderContract.setAddress(
      '0x0100000000000000000000000000000000000000000000000000000000000000',
      dataProviderAddress,
      {
        gasPrice: config.gasPrice,
        gasLimit: config.gasLimit,
      }
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
