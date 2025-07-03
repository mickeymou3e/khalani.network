import { Provider } from '@ethersproject/providers';
import type { StableDebtToken } from '@src/typechain/godwoken/StableDebtToken';
import { StableDebtToken__factory } from '@src/typechain/godwoken/factories/StableDebtToken__factory';

import { Signer } from 'ethers';

export const stableDebtTokenConnect =
  (signerOrProvider: Signer | Provider): ((tokenAddress: string) => StableDebtToken | null) =>
  (tokenAddress: string) => {
    return StableDebtToken__factory.connect(tokenAddress, signerOrProvider);
  };

export default stableDebtTokenConnect;
