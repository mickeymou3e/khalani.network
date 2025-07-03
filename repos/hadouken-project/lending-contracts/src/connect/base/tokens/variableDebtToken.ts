import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { VariableDebtToken } from '@src/typechain/godwoken/VariableDebtToken';
import { VariableDebtToken__factory } from '@src/typechain/godwoken/factories/VariableDebtToken__factory';

export default (
  signerOrProvider: Signer | Provider
): ((tokenAddress: string) => VariableDebtToken) => {
  return (tokenAddress: string) => {
    return VariableDebtToken__factory.connect(tokenAddress, signerOrProvider);
  };
};
