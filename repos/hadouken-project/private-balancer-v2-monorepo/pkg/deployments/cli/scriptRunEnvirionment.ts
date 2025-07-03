import { ScriptRunEnvironment } from './types';
import { ChainConfigWithDeployer } from '../../../chain-config/types';
import { Wallet, providers } from 'ethers';

const setupScriptRunEnvironment = async (config: ChainConfigWithDeployer): Promise<ScriptRunEnvironment> => {
  const provider = new providers.JsonRpcProvider(config.rpcUrl, Number(config.chainId));
  const deployer = new Wallet(config.deployer, provider);

  return {
    deployer,
    transactionOverrides: {
      gasLimit: config.gasLimit,
      gasPrice: config.gasPrice,
    },
    network: config.network,
    chainId: config.chainId,
  };
};

export default setupScriptRunEnvironment;
