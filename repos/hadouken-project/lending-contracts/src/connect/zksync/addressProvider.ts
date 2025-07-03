import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { LendingPoolAddressesProvider } from '@src/typechain/zksync/LendingPoolAddressesProvider';
import { LendingPoolAddressesProvider__factory } from '@src/typechain/zksync/factories/LendingPoolAddressesProvider__factory';

import { Environments } from '@src/types/types';

import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): LendingPoolAddressesProvider | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.addressProvider) {
    return null;
  }

  return LendingPoolAddressesProvider__factory.connect(
    contractsConfig.addressProvider,
    signerOrProvider
  );
}
