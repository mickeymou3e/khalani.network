import { Provider } from '@ethersproject/providers';

import { getContractsConfigFromNetworkName } from '../../filesManager';

import { LendingRateOracle } from '@src/typechain/godwoken/LendingRateOracle';
import { LendingRateOracle__factory } from '@src/typechain/godwoken/factories/LendingRateOracle__factory';

import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { Signer } from 'ethers';
import { getContractsConfigStatic } from './utils';

export const lendingRateOracle = (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): LendingRateOracle | null => {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.lendingRateOracle) {
    return null;
  }

  return LendingRateOracle__factory.connect(contractsConfig.lendingRateOracle, signerOrProvider);
};

export default lendingRateOracle;
