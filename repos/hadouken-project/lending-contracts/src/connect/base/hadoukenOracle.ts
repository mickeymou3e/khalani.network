import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { HadoukenOracle } from '@src/typechain/godwoken/HadoukenOracle';
import { HadoukenOracle__factory } from '@src/typechain/godwoken/factories/HadoukenOracle__factory';

import { Environments } from '@src/types/types';
import { BaseChain } from '../../types';
import { getContractsConfigStatic } from './utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): HadoukenOracle | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.hadoukenOracle) {
    return null;
  }

  return HadoukenOracle__factory.connect(contractsConfig.hadoukenOracle, signerOrProvider);
}
