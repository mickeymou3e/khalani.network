import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { LendingPool } from '@src/typechain/zksync/LendingPool';
import { LendingPool__factory } from '@src/typechain/zksync/factories/LendingPool__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  ignoreProxy = false
): LendingPool | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig) {
    return null;
  }
  return LendingPool__factory.connect(
    ignoreProxy ? contractsConfig.lendingPool : contractsConfig.lendingPoolProxy,
    signerOrProvider
  );
}
