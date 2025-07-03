import { Provider } from '@ethersproject/providers';

import { IGnosisSafe } from '@src/typechain/godwoken/IGnosisSafe';
import { IGnosisSafe__factory } from '@src/typechain/godwoken/factories/IGnosisSafe__factory';
import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { Signer, ethers } from 'ethers';
import { getConfigFromNetworkName } from '../../filesManager';

import { getConfigStatic } from './utils';

export default function connectGnosisSafe(
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
) {
  let config = null;
  if (runTime) {
    config = getConfigFromNetworkName(`${network}-${environment}`, process.env.CLI_DEPLOYER);
  } else {
    config = getConfigStatic(environment, network);
  }

  if (!config?.gnosisSafe) {
    return null;
  }

  const contract = new ethers.Contract(
    config.gnosisSafe,
    IGnosisSafe__factory.abi,
    signerOrProvider
  ).connect(signerOrProvider) as IGnosisSafe;

  return contract;
}
