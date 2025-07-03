import { writeToContractsConfig } from '@scripts/filesManager';

import { connectToContractsRuntime } from '@scripts/connect';
import { deployLendingPool } from '@scripts/deploy';
import { Cli } from '@src/types';
import { delay, getConfigInstant } from '@src/utils';
import { sendGnosisSafeTransaction } from '../gnosisSafe';

export const setLendingPoolImplCli: Cli = async ({ environment, parentCli }) => {
  const addressProvider = connectToContractsRuntime(environment).addressProvider;
  if (!addressProvider) throw Error('addressProvider not found');

  const config = getConfigInstant(environment.chainId, environment.env);
  if (!config) throw Error('config not found');
  const isGnosisSafe = config.isGnosisSafe;

  const lendingPoolAddress = await deployLendingPool(environment, true);
  writeToContractsConfig(
    { lendingPool: lendingPoolAddress },
    environment.chainId,
    environment.env,
    environment.networkName
  );
  await delay(environment.delayInMs);

  if (isGnosisSafe) {
    const functionData = addressProvider.interface.encodeFunctionData('setLendingPoolImpl', [
      lendingPoolAddress,
    ]);

    await sendGnosisSafeTransaction(environment, addressProvider.address, functionData);
  } else {
    console.log('set lending pool impl');
    const gasPrice = await environment.deployer.getGasPrice();
    await addressProvider.setLendingPoolImpl(lendingPoolAddress, {
      gasPrice: gasPrice,
      gasLimit: config.gasLimit ? config.gasLimit * 5 : undefined,
    });
  }
  console.log('Set new lending pool implementation');
};
