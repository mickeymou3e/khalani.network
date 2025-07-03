import { Provider } from '@ethersproject/providers';

import { ATokensAndRatesHelper } from '@src/typechain/godwoken/ATokensAndRatesHelper';
import { ATokensAndRatesHelper__factory } from '@src/typechain/godwoken/factories/ATokensAndRatesHelper__factory';

import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../../filesManager';
import { getContractsConfigStatic } from '../utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): ATokensAndRatesHelper | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.aTokenAndRateHelper) {
    return null;
  }

  return ATokensAndRatesHelper__factory.connect(
    contractsConfig.aTokenAndRateHelper,
    signerOrProvider
  );
}
