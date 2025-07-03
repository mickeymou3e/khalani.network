import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import type { ERC20Test } from '@src/typechain/godwoken/ERC20Test';
import { ERC20Test__factory } from '@src/typechain/godwoken/factories/ERC20Test__factory';

export const erc20TestTokenConnect = (
  signerOrProvider: Signer | Provider
): ((tokenAddress: string) => ERC20Test) => {
  return (tokenAddress: string) => {
    return ERC20Test__factory.connect(tokenAddress, signerOrProvider);
  };
};

export default erc20TestTokenConnect;
