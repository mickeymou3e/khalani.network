import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { getContractsConfigStatic } from '../base/utils';

import { StdReference } from '@src/typechain/godwoken/StdReference';
import { StdReference__factory } from '@src/typechain/godwoken/factories/StdReference__factory';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): StdReference | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.stdReference) {
    return null;
  }

  return StdReference__factory.connect(contractsConfig.stdReference, signerOrProvider);
}
