import { Provider } from '@ethersproject/providers';

import { ATokensAndRatesHelper } from '@src/typechain/zksync/ATokensAndRatesHelper';
import { ATokensAndRatesHelper__factory } from '@src/typechain/zksync/factories/ATokensAndRatesHelper__factory';
import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '@src/zksync/config';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../../filesManager';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): ATokensAndRatesHelper | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.aTokenAndRateHelper) {
    return null;
  }

  return ATokensAndRatesHelper__factory.connect(
    contractsConfig.aTokenAndRateHelper,
    signerOrProvider
  );
}
