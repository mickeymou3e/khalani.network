import { Provider } from '@ethersproject/providers';
import type { UserBalances } from '@src/typechain/godwoken/UserBalances';
import { UserBalances__factory } from '@src/typechain/godwoken/factories/UserBalances__factory';

import { getConnectConfig } from '@src/utils/utils';
import { Signer } from 'ethers';

export const userBalancesConnect = (
  chainId: string,
  signerOrProvider: Signer | Provider,
  runTime: boolean = false
): UserBalances | null => {
  const contractsConfig = getConnectConfig(chainId, runTime);

  return UserBalances__factory.connect(contractsConfig.userBalances, signerOrProvider);
};

export default userBalancesConnect;
