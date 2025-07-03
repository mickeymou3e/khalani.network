import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { LendingPoolAddressesProviderRegistry } from '@src/typechain/zksync/LendingPoolAddressesProviderRegistry';
import { LendingPoolAddressesProviderRegistry__factory } from '@src/typechain/zksync/factories/LendingPoolAddressesProviderRegistry__factory';

import { Environments } from '@src/types/types';
import { getContractsConfigFromNetworkName } from '../../filesManager';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): LendingPoolAddressesProviderRegistry | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.registry) {
    return null;
  }

  return LendingPoolAddressesProviderRegistry__factory.connect(
    contractsConfig.registry,
    signerOrProvider
  );
}
