import prompts from 'prompts';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { getDeployer } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { Config, Environments } from '@src/types/types';
import { getProvider } from '@src/utils';
import { providers } from 'ethers';

const setupScriptRunEnvironment = async (config: Config): Promise<ScriptRunEnvironment> => {
  const env = config.env as Environments;
  const provider = getProvider(config.chainId)(env, false);
  const deployer = await getDeployer(config);

  const { confirmed } = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message: `Use ${deployer.address} wallet`,
    initial: true,
  });

  if (!confirmed) {
    throw new Error('Set env variable DEPLOYER_PRIVATE_KEY');
  }

  return {
    env,
    networkName: config.network,
    chainId: config.chainId,
    address: deployer.address,
    delayInMs: Number(config.delay),
    provider: provider as unknown as providers.JsonRpcProvider,
    deployer,
    transactionOverrides: { gasPrice: config.gasPrice, gasLimit: config.gasLimit },
  };
};

export const setupScriptRunEnvironmentForHardhat = async (
  config: Config,
  deployer: SignerWithAddress
): Promise<ScriptRunEnvironment> => {
  const env = config.env as Environments;
  const provider = getProvider(config.chainId)(env, false);

  return {
    env,
    chainId: config.chainId,
    networkName: config.network,
    delayInMs: Number(config.delay) ?? 0,
    address: deployer.address,
    provider: provider as unknown as providers.JsonRpcProvider,
    deployer,
    transactionOverrides: { gasPrice: config.gasPrice, gasLimit: config.gasLimit },
  };
};

export default setupScriptRunEnvironment;
