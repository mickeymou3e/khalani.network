import { Provider } from '@ethersproject/providers';
import type { HadoukenOracle } from '@src/typechain/godwoken/HadoukenOracle';
import { HadoukenOracle__factory } from '@src/typechain/godwoken/factories/HadoukenOracle__factory';

import { getConnectConfig } from '@src/utils/utils';
import { Signer } from 'ethers';

export const hadoukenOracleConnect = (
  chainId: string,
  signerOrProvider: Signer | Provider,
  runTime: boolean = false
): HadoukenOracle | null => {
  const contractsConfig = getConnectConfig(chainId, runTime);

  return HadoukenOracle__factory.connect(contractsConfig.hadoukenOracle, signerOrProvider);
};

export default hadoukenOracleConnect;
