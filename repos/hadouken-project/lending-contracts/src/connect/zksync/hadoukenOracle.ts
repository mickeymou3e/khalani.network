import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { HadoukenOracle } from '@src/typechain/zksync/HadoukenOracle';
import { HadoukenOracle__factory } from '@src/typechain/zksync/factories/HadoukenOracle__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): HadoukenOracle | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.hadoukenOracle) {
    return null;
  }

  return HadoukenOracle__factory.connect(contractsConfig.hadoukenOracle, signerOrProvider);
}
