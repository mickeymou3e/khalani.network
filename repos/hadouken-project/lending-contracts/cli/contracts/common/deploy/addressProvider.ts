import { connectToContractsRuntime } from '@scripts/connect';
import { deployAddressProvider } from '@scripts/deploy';
import { writeToContractsConfig } from '@scripts/filesManager';
import { getConfigFromNetworkName } from '@src/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { delay, waitForTx } from '@src/utils';

export const deployAddressProviderCli = async (environment: ScriptRunEnvironment) => {
  const config = getConfigFromNetworkName(environment.networkName, process.env.CLI_DEPLOYER);
  const marketId = config.marketId;

  const addressProviderAddress = await deployAddressProvider(environment, marketId);

  writeToContractsConfig(
    { addressProvider: addressProviderAddress },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  await delay(environment.delayInMs);

  console.log(`Address Provider have been deployed at address: ${addressProviderAddress}`);

  const addressProviderContract = connectToContractsRuntime(environment).addressProvider;

  if (!addressProviderContract) throw Error('addressProviderContract not found');

  await waitForTx(await addressProviderContract.setPoolAdmin(environment.address));

  await delay(environment.delayInMs);

  const poolAdmin = await addressProviderContract.getPoolAdmin();

  console.log('Pool Admin', poolAdmin);

  await waitForTx(
    await addressProviderContract.setEmergencyAdmin(
      environment.address,
      environment.transactionOverrides
    )
  );
  await delay(environment.delayInMs);
  console.log('Emergency Admin', await addressProviderContract.getPoolAdmin());
  return addressProviderAddress;
};
