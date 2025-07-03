import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { LendingPoolAddressesProviderRegistry } from '@src/typechain/godwoken/LendingPoolAddressesProviderRegistry';
import { LendingPoolAddressesProviderRegistry__factory } from '@src/typechain/godwoken/factories/LendingPoolAddressesProviderRegistry__factory';

import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { getContractsConfigFromNetworkName } from '../../filesManager';
import { getContractsConfigStatic } from '../base/utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): LendingPoolAddressesProviderRegistry | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.registry) {
    return null;
  }

  return LendingPoolAddressesProviderRegistry__factory.connect(
    contractsConfig.registry,
    signerOrProvider
  );
}
