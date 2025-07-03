import { Provider } from '@ethersproject/providers';

import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { LendingPoolConfigurator } from '@src/typechain/zksync/LendingPoolConfigurator';
import { LendingPoolConfigurator__factory } from '@src/typechain/zksync/factories/LendingPoolConfigurator__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): LendingPoolConfigurator | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.poolConfiguratorProxy) {
    return null;
  }

  return LendingPoolConfigurator__factory.connect(
    contractsConfig.poolConfiguratorProxy,
    signerOrProvider
  );
}
