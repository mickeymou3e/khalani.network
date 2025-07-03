import { delay, LendingContracts, waitForTx } from '@src/utils';

import { connectToContractsRuntime } from '@scripts/connect';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { HadoukenCollector } from '@src/zksync';

export async function deployZkSyncTreasury(environment: ZkSyncDeploymentEnvironment) {
  const { deployer, walletWithProvider } = environment;

  const hadoukenCollectorArtifact = await deployer.loadArtifact(LendingContracts.HadoukenCollector);

  console.log('Deploying HadoukenCollector contract');

  const hadoukenCollectorContract = await deployer.deploy(hadoukenCollectorArtifact);

  const hadoukenCollectorAddress = hadoukenCollectorContract.address;

  await delay(environment.delayInMs);

  console.log(`Hadouken collector contract was deployed to ${hadoukenCollectorAddress}`);

  writeToContractsConfig(
    { hadoukenCollector: hadoukenCollectorAddress },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  console.log('Deploying Treasury contract');

  const proxyArtifact = await deployer.loadArtifact(
    LendingContracts.InitializableAdminUpgradeabilityProxy
  );

  const proxyContract = await deployer.deploy(proxyArtifact);

  const treasuryAddress = proxyContract.address;

  await delay(environment.delayInMs);

  const hdkCollector = connectToContractsRuntime(environment).hadoukenCollector;
  if (!hdkCollector) throw Error('hdkCollector not found');

  console.log(`Treasury contract was deployed to ${treasuryAddress}`);

  writeToContractsConfig(
    { treasury: treasuryAddress },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  const treasury = connectToContractsRuntime(environment).treasury;
  if (!treasury) throw Error('treasury not found');

  console.log('Running AdminProxy initialize function');

  await waitForTx(
    await treasury['initialize(address,address,bytes)'](
      hadoukenCollectorAddress,
      walletWithProvider.address,
      '0x8129fc1c'
    )
  );

  await delay(environment.delayInMs);

  console.log('Running HadoukenCollector initialize function');

  await waitForTx(await (hdkCollector as HadoukenCollector).initialize());

  await delay(environment.delayInMs);
  // for v2
  // await waitForTx(await hdkCollector.initialize(walletWithProvider.address));

  return treasuryAddress;
}
