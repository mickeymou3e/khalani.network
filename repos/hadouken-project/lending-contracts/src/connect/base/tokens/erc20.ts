import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { ERC20 } from '@src/typechain/godwoken/ERC20';
import { ERC20__factory } from '@src/typechain/godwoken/factories/ERC20__factory';

export const Erc20Token = (
  signerOrProvider: Signer | Provider
): ((tokenAddress: string) => ERC20) => {
  return (tokenAddress: string) => {
    return ERC20__factory.connect(tokenAddress, signerOrProvider);
  };
};
