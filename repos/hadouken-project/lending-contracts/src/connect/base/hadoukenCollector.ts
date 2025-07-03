import { Provider } from '@ethersproject/providers';

import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { HadoukenCollectorV2 } from '@src/typechain/godwoken/HadoukenCollectorV2';
import { HadoukenCollectorV2__factory } from '@src/typechain/godwoken/factories/HadoukenCollectorV2__factory';

import { Environments } from '@src/types/types';
import { BaseChain } from '../../types';
import { getContractsConfigStatic } from './utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): HadoukenCollectorV2 | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.hadoukenCollector) {
    return null;
  }

  return HadoukenCollectorV2__factory.connect(contractsConfig.hadoukenCollector, signerOrProvider);
}
