import { Provider } from '@ethersproject/providers';

import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { LendingPoolConfigurator } from '@src/typechain/godwoken/LendingPoolConfigurator';
import { LendingPoolConfigurator__factory } from '@src/typechain/godwoken/factories/LendingPoolConfigurator__factory';

import { Environments } from '@src/types/types';
import { BaseChain } from '../../types';
import { getContractsConfigStatic } from '../base/utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): LendingPoolConfigurator | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network, runTime);
  }

  if (!contractsConfig || !contractsConfig.poolConfiguratorProxy) {
    return null;
  }

  return LendingPoolConfigurator__factory.connect(
    contractsConfig.poolConfiguratorProxy,
    signerOrProvider
  );
}
