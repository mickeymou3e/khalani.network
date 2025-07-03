import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { LendingPool } from '@src/typechain/godwoken/LendingPool';
import { LendingPool__factory } from '@src/typechain/godwoken/factories/LendingPool__factory';

import { Environments } from '@src/types/types';
import { BaseChain } from '../../types';
import { getContractsConfigStatic } from '../base/utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  ignoreProxy = false,
  network: BaseChain = 'godwoken'
): LendingPool | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig) {
    return null;
  }

  return LendingPool__factory.connect(
    ignoreProxy ? contractsConfig.lendingPool : contractsConfig.lendingPoolProxy,
    signerOrProvider
  );
}
