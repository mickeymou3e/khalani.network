import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { StableDebtToken } from '@src/typechain/zksync/StableDebtToken';
import { StableDebtToken__factory } from '@src/typechain/zksync/factories/StableDebtToken__factory';

export default (
  signerOrProvider: Signer | Provider
): ((tokenAddress: string) => StableDebtToken) => {
  return (tokenAddress: string) => {
    return StableDebtToken__factory.connect(tokenAddress, signerOrProvider);
  };
};
