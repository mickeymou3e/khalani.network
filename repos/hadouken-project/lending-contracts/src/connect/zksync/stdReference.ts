import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { StdReference } from '@src/typechain/zksync/StdReference';
import { StdReference__factory } from '@src/typechain/zksync/factories/StdReference__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): StdReference | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.stdReference) {
    return null;
  }

  return StdReference__factory.connect(contractsConfig.stdReference, signerOrProvider);
}
