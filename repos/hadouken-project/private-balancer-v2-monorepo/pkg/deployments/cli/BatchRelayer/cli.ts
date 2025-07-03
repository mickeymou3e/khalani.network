import prompts from 'prompts';
import { ContractFactory, ethers } from 'ethers';
import { BatchRelayerLibrary__factory } from '@hadouken-project/typechain';
import * as batchRelayerLibrary from '@balancer-labs/v2-standalone-utils/artifacts/contracts/BatchRelayerLibrary.sol/BatchRelayerLibrary.json';
import { Cli, ScriptRunEnvironment } from '../types';
import { getDeploymentsAddresses } from '../config.command';
import { saveDeploymentAddress } from '../utils/save';

const deploy = async (environment: ScriptRunEnvironment) => {
  const BatchRelayerFactory = new ContractFactory(
    batchRelayerLibrary.abi,
    batchRelayerLibrary.bytecode,
    environment.deployer
  );

  const { Vault } = getDeploymentsAddresses(environment.network);

  const deployRequest = BatchRelayerFactory.getDeployTransaction(
    Vault,
    ethers.constants.AddressZero,
    ethers.constants.AddressZero,
    true,
    '0x1'
  );

  const batchRelayerGasLimit = await environment.deployer.estimateGas(deployRequest);

  deployRequest.gasLimit = batchRelayerGasLimit;

  const receipt = await (await environment.deployer.sendTransaction(deployRequest)).wait();

  const batchRelayer = BatchRelayerLibrary__factory.connect(receipt.contractAddress, environment.deployer);

  const entrypointAddress = await batchRelayer.getEntrypoint();
  const vaultAddress = await batchRelayer.getVault();
  const batchRelayerLibraryAddress = receipt.contractAddress;

  console.log('BatchRelayerLibrary address', receipt.contractAddress);
  console.log('BatchRelayer address', entrypointAddress);
  console.log('Vault address', vaultAddress);

  saveDeploymentAddress('BatchRelayerLibrary', batchRelayerLibraryAddress, environment.network);
  saveDeploymentAddress('BatchRelayer', entrypointAddress, environment.network);

  process.exit(0);
};

const getEntrypoint = async (environment: ScriptRunEnvironment) => {
  const { BatchRelayerLibrary } = getDeploymentsAddresses(environment.network);

  const batchRelayer = BatchRelayerLibrary__factory.connect(BatchRelayerLibrary, environment.deployer);

  const entrypointAddress = await batchRelayer.getEntrypoint();

  const vaultAddress = await batchRelayer.getVault();

  console.log('entrypointAddress', entrypointAddress);
  console.log('vaultAddress', vaultAddress);

  process.exit(0);
};

const BatchRelayerCli: Cli = async ({ environment, parentCli }) => {
  const choices = [
    { title: 'deploy', value: 'deploy' },
    { title: 'getEntrypoint', value: 'getEntrypoint' },
  ];

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select action',
      choices,
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  switch (action) {
    case 'deploy':
      await deploy(environment);
      break;

    case 'getEntrypoint':
      await getEntrypoint(environment);
      break;
  }

  return parentCli?.({ environment });
};

export default BatchRelayerCli;
