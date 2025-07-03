import { Provider } from '@ethersproject/providers';
import type { LendingPoolAddressesProvider } from '@src/typechain/godwoken/LendingPoolAddressesProvider';
import { LendingPoolAddressesProvider__factory } from '@src/typechain/godwoken/factories/LendingPoolAddressesProvider__factory';

import { getConnectConfig } from '@src/utils/utils';
import { Signer } from 'ethers';

export const addressProviderConnect = (
  chainId: string,
  signerOrProvider: Signer | Provider,
  runTime: boolean = false
): LendingPoolAddressesProvider | null => {
  const contractsConfig = getConnectConfig(chainId, runTime);

  return LendingPoolAddressesProvider__factory.connect(
    contractsConfig.addressProvider,
    signerOrProvider
  );
};

export default addressProviderConnect;
