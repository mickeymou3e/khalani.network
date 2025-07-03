import { Provider } from '@ethersproject/providers';
import type { LendingPool } from '@src/typechain/godwoken/LendingPool';
import { LendingPool__factory } from '@src/typechain/godwoken/factories/LendingPool__factory';

import { getConnectConfig } from '@src/utils/utils';
import { Signer } from 'ethers';

export const poolConnect = (
  chainId: string,
  signerOrProvider: Signer | Provider,
  runTime: boolean = false
): LendingPool | null => {
  const contractsConfig = getConnectConfig(chainId, runTime);

  return LendingPool__factory.connect(contractsConfig.lendingPoolProxy, signerOrProvider);
};

export default poolConnect;
