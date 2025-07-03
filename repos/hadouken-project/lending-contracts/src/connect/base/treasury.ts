import { Provider } from '@ethersproject/providers';

import { InitializableAdminUpgradeabilityProxy } from '@src/typechain/godwoken/InitializableAdminUpgradeabilityProxy';
import { InitializableAdminUpgradeabilityProxy__factory } from '@src/typechain/godwoken/factories/InitializableAdminUpgradeabilityProxy__factory';

import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { getContractsConfigStatic } from './utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): InitializableAdminUpgradeabilityProxy | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.treasury) {
    return null;
  }

  return InitializableAdminUpgradeabilityProxy__factory.connect(
    contractsConfig.treasury,
    signerOrProvider
  );
}
