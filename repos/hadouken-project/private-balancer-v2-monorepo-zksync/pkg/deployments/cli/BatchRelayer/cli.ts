import prompts from 'prompts';
import { getDeploymentsByRuntimeEnv } from '../../../config/src/deployments';
import { Cli, ScriptRunEnvironment } from '../types';
import { Contract } from 'zksync-web3';
import BatchRelayerLibrary_JSON from '../../../standalone-utils/artifacts-zk/contracts/BatchRelayerLibrary.sol/BatchRelayerLibrary.json';

const getEntrypoint = async (environment: ScriptRunEnvironment) => {
  const { BatchRelayerLibrary } = getDeploymentsByRuntimeEnv(environment.network);

  const batchRelayer = new Contract(BatchRelayerLibrary, BatchRelayerLibrary_JSON.abi, environment.deployer);

  const entrypointAddress = await batchRelayer.getEntrypoint();

  const vaultAddress = await batchRelayer.getVault();

  console.log('entrypointAddress', entrypointAddress);
  console.log('vaultAddress', vaultAddress);

  process.exit(0);
};

const BatchRelayerCli: Cli = async ({ environment, parentCli }) => {
  const choices = [{ title: 'getEntrypoint', value: 'getEntrypoint' }];

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
    case 'getEntrypoint':
      await getEntrypoint(environment);
      break;
  }

  return BatchRelayerCli({ environment, parentCli });
};

export default BatchRelayerCli;
