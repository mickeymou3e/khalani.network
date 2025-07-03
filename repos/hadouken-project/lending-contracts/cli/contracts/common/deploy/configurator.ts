import { writeToContractsConfig } from '@scripts/filesManager';
import { delay, getConfigInstant, getContractsConfigInstant, waitForTx } from '@src/utils';

import { sendGnosisSafeTransaction } from '@cli/contracts/common/gnosisSafe';
import { connectToContractsRuntime } from '@scripts/connect';
import { deployLendingPoolConfigurator } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployLendingPoolConfiguratorCli = async (environment: ScriptRunEnvironment) => {
  const { env, chainId, delayInMs } = environment;
  const contractsConfig = getContractsConfigInstant(chainId, env, true);
  const config = getConfigInstant(chainId, env, true);
  if (!config) throw Error('config not found');
  if (!contractsConfig) throw Error('contractsConfig not found');
  const librariesAddress = contractsConfig.libraries;
  const addressProviderAddress = contractsConfig?.addressProvider;

  if (!librariesAddress) {
    console.log(`Libraries has not been deployed! Aborting deployment of lending pool.`);
    return;
  }
  if (!addressProviderAddress) {
    console.log(`Address provider has not been deployed! Aborting deployment of lending pool.`);
    return;
  }

  const addressProvider = connectToContractsRuntime(environment).addressProvider;
  if (!addressProvider) throw Error('addressProvider not found');

  const configuratorAddress = await deployLendingPoolConfigurator(environment);

  console.log('setting lending pool configuration impl');
  await delay(delayInMs);

  const isGnosisSafe = config.isGnosisSafe;

  if (isGnosisSafe) {
    const functionData = addressProvider.interface.encodeFunctionData(
      'setLendingPoolConfiguratorImpl',
      [configuratorAddress]
    );
    await sendGnosisSafeTransaction(environment, addressProvider.address, functionData);
    console.log(
      'Upgrade Pool configuration impl request to gnosis safe (remember to update configurator Proxy address after deploy)'
    );
  } else {
    const setLendingPoolConfImplGasLimit =
      await addressProvider.estimateGas.setLendingPoolConfiguratorImpl(configuratorAddress);

    await waitForTx(
      await addressProvider.setLendingPoolConfiguratorImpl(configuratorAddress, {
        gasLimit: setLendingPoolConfImplGasLimit,
        gasPrice: config.gasPrice,
      })
    );
  }

  console.log('setting lending pool configuration impl - Done');

  const configuratorProxy = await addressProvider.getLendingPoolConfigurator();

  writeToContractsConfig(
    { poolConfiguratorProxy: configuratorProxy },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  console.log(`setLendingPoolConfiguratorImpl Done. Proxy configuration: ${configuratorProxy}`);
  await delay(delayInMs);
};
