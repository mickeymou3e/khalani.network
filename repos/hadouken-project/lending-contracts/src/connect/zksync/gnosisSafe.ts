import { Provider } from '@ethersproject/providers';
import { Environments } from '@src/types/types';
import { getConfigFromNetworkName } from '../../filesManager';

import { getZkSyncConfigStatic } from '@src/zksync/config';
import { Signer, ethers } from 'ethers';

import { IGnosisSafe } from '@src/typechain/zksync/IGnosisSafe';
import { IGnosisSafe__factory } from '@src/typechain/zksync/factories/IGnosisSafe__factory';

export default function connectGnosisSafe(
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
) {
  let config = null;
  if (runTime) {
    config = getConfigFromNetworkName(`zksync-${environment}`, process.env.CLI_DEPLOYER);
  } else {
    config = getZkSyncConfigStatic(environment);
  }

  if (!config.gnosisSafe) {
    return null;
  }

  const contract = new ethers.Contract(
    config.gnosisSafe,
    IGnosisSafe__factory.abi,
    signerOrProvider
  ).connect(signerOrProvider) as IGnosisSafe;

  return contract;
}
