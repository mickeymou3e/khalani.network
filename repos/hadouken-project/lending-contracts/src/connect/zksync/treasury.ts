import { Provider } from '@ethersproject/providers';

import { getZkSyncContractsConfigStatic } from '@src/zksync';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { InitializableAdminUpgradeabilityProxy } from '@src/typechain/zksync/InitializableAdminUpgradeabilityProxy';
import { InitializableAdminUpgradeabilityProxy__factory } from '@src/typechain/zksync/factories/InitializableAdminUpgradeabilityProxy__factory';

import { Environments } from '@src/types/types';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): InitializableAdminUpgradeabilityProxy | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.treasury) {
    return null;
  }

  return InitializableAdminUpgradeabilityProxy__factory.connect(
    contractsConfig.treasury,
    signerOrProvider
  );
}
