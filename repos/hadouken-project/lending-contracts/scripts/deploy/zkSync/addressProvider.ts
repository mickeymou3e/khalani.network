import { Contract } from 'zksync-web3';

import { writeToContractsConfig } from '@scripts/filesManager';
import { LendingPoolAddressesProvider__factory } from '@src/typechain/zksync';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { LendingContracts, delay, waitForTx } from '@src/utils';

export async function deployZkSyncAddressProvider(
  environment: ZkSyncDeploymentEnvironment,
  marketId: string = 'ZkSync'
): Promise<string> {
  console.log('Deploying Address provider');

  const { deployer, walletWithProvider } = environment;

  const addressProviderArtifact = await deployer.loadArtifact(LendingContracts.AddressProvider);

  const addressProvider = await deployer.deploy(addressProviderArtifact, [marketId]);

  console.log(`Address provider deployed: ${addressProvider.address}`);

  writeToContractsConfig(
    { addressProvider: addressProvider.address },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  const addressProviderContract = new Contract(
    addressProvider.address,
    LendingPoolAddressesProvider__factory.abi,
    walletWithProvider
  );

  await waitForTx(await addressProviderContract.setPoolAdmin(walletWithProvider.address));

  await delay(1000);

  console.log('Getting Pool Admin', await addressProviderContract.getPoolAdmin());

  await waitForTx(await addressProviderContract.setEmergencyAdmin(walletWithProvider.address));

  await delay(1000);

  console.log('Getting Emergency Admin', await addressProviderContract.getPoolAdmin());

  return addressProvider.address;
}
