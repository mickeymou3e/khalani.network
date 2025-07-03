import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { StableDebtToken } from '@src/typechain/godwoken/StableDebtToken';
import { StableDebtToken__factory } from '@src/typechain/godwoken/factories/StableDebtToken__factory';

export default (
  signerOrProvider: Signer | Provider
): ((tokenAddress: string) => StableDebtToken) => {
  return (tokenAddress: string) => {
    return StableDebtToken__factory.connect(tokenAddress, signerOrProvider);
  };
};
