import { Provider } from '@ethersproject/providers';
import type { LendingPoolAddressesProviderRegistry } from '@src/typechain/godwoken/LendingPoolAddressesProviderRegistry';
import { LendingPoolAddressesProviderRegistry__factory } from '@src/typechain/godwoken/factories/LendingPoolAddressesProviderRegistry__factory';

import { getConnectConfig } from '@src/utils/utils';
import { Signer } from 'ethers';

export const registryConnect = (
  chainId: string,
  signerOrProvider: Signer | Provider,
  runTime: boolean = false
): LendingPoolAddressesProviderRegistry | null => {
  const contractsConfig = getConnectConfig(chainId, runTime);

  return LendingPoolAddressesProviderRegistry__factory.connect(
    contractsConfig.registry,
    signerOrProvider
  );
};

export default registryConnect;
