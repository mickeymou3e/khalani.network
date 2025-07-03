import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { AToken } from '@src/typechain/godwoken/AToken';
import { AToken__factory } from '@src/typechain/godwoken/factories/AToken__factory';

export default (signerOrProvider: Signer | Provider): ((tokenAddress: string) => AToken) => {
  return (tokenAddress: string) => {
    return AToken__factory.connect(tokenAddress, signerOrProvider);
  };
};
