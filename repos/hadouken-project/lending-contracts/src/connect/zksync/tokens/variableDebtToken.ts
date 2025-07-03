import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { VariableDebtToken } from '@src/typechain/zksync/VariableDebtToken';
import { VariableDebtToken__factory } from '@src/typechain/zksync/factories/VariableDebtToken__factory';

export default (
  signerOrProvider: Signer | Provider
): ((tokenAddress: string) => VariableDebtToken) => {
  return (tokenAddress: string) => {
    return VariableDebtToken__factory.connect(tokenAddress, signerOrProvider);
  };
};
