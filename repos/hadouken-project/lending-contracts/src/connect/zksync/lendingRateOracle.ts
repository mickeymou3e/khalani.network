import { Provider } from '@ethersproject/providers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { LendingRateOracle } from '@src/typechain/zksync/LendingRateOracle';
import { LendingRateOracle__factory } from '@src/typechain/zksync/factories/LendingRateOracle__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '@src/zksync';
import { Signer } from 'ethers';

export const lendingRateOracle = (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): LendingRateOracle | null => {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.lendingRateOracle) {
    return null;
  }

  return LendingRateOracle__factory.connect(contractsConfig.lendingRateOracle, signerOrProvider);
};

export default lendingRateOracle;
