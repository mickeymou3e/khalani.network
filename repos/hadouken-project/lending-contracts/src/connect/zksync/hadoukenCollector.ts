import { Provider } from '@ethersproject/providers';

import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { HadoukenCollector } from '@src/typechain/zksync/HadoukenCollector';
import { HadoukenCollector__factory } from '@src/typechain/zksync/factories/HadoukenCollector__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): HadoukenCollector | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.hadoukenCollector) {
    return null;
  }

  return HadoukenCollector__factory.connect(contractsConfig.hadoukenCollector, signerOrProvider);
}
