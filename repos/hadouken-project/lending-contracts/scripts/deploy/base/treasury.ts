import { connectToContractsRuntime } from '@scripts/connect';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { LendingContracts, delay, getConfigInstant } from '@src/utils';
import { ethers } from 'hardhat';

export async function deployBaseTreasury(environment: ScriptRunEnvironment) {
  console.log('Deploying Treasury');
  const { deployer, chainId, env, delayInMs, networkName } = environment;
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const hadoukenCollectorFactory = await ethers.getContractFactory(
    LendingContracts.HadoukenCollector,
    deployer
  );

  const gasPrice = await deployer.getGasPrice();

  const hadoukenCollectorRequest = hadoukenCollectorFactory.getDeployTransaction({
    gasPrice: gasPrice,
    gasLimit: config.gasLimit,
  });

  const gas = await deployer.estimateGas(hadoukenCollectorRequest);
  hadoukenCollectorRequest.gasLimit = gas;

  const hadoukenCollectorReceipt = await (
    await deployer.sendTransaction(hadoukenCollectorRequest)
  ).wait();

  const hadoukenCollectorAddress = hadoukenCollectorReceipt.contractAddress;

  console.log(`Hadouken collector deployed: ${hadoukenCollectorAddress}`);

  await delay(delayInMs);

  const proxyFactory = await ethers.getContractFactory(
    LendingContracts.InitializableAdminUpgradeabilityProxy,
    deployer
  );

  const proxyRequest = proxyFactory.getDeployTransaction({
    gasPrice: gasPrice,
    gasLimit: config.gasLimit,
  });

  const proxyRequestGasLimit = await deployer.estimateGas(proxyRequest);
  proxyRequest.gasLimit = proxyRequestGasLimit;

  const proxyReceipt = await (await deployer.sendTransaction(proxyRequest)).wait();

  const treasuryAddress = proxyReceipt.contractAddress;

  writeToContractsConfig(
    { treasury: treasuryAddress, hadoukenCollector: hadoukenCollectorAddress },
    chainId,
    env,
    networkName
  );

  await delay(environment.delayInMs);

  console.log(`Treasury deployed: ${treasuryAddress}`);

  const proxyContract = connectToContractsRuntime(environment).treasury;
  const hdkCollector = connectToContractsRuntime(environment).hadoukenCollector;

  if (!proxyContract) throw Error('proxyContract not found');
  if (!hdkCollector) throw Error('hdkCollector not found');
  console.log('proxyContract', proxyContract?.address);

  const gasLimit = await proxyContract.estimateGas['initialize(address,address,bytes)'](
    hadoukenCollectorAddress,
    deployer.address,
    '0x8129fc1c' //initialize()
  );

  const proxyInitializeReceipt = await proxyContract['initialize(address,address,bytes)'](
    hadoukenCollectorAddress,
    deployer.address,
    '0x8129fc1c',
    { gasLimit: gasLimit }
  );

  await proxyInitializeReceipt.wait();

  await delay(delayInMs);

  console.log('proxy initialized');

  // TODO add if collector is in version 2
  // const hdkControllerInitGasLimit = await hdkCollector.estimateGas.initialize(environment.address);

  // console.log('hdkControllerInitGasLimit', hdkControllerInitGasLimit);

  // await delay(delayInMs);

  // (
  //   await hdkCollector.initialize(environment.address, { gasLimit: hdkControllerInitGasLimit })
  // ).wait();

  await delay(delayInMs);

  return {
    treasuryAddress,
    hadoukenCollectorAddress,
  };
}
