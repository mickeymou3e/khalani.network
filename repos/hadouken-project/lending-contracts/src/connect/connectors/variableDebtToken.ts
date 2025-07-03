import { Provider } from '@ethersproject/providers';
import type { VariableDebtToken } from '@src/typechain/godwoken/VariableDebtToken';
import { VariableDebtToken__factory } from '@src/typechain/godwoken/factories/VariableDebtToken__factory';

import { Signer } from 'ethers';

export const variableDebtTokenConnect =
  (signerOrProvider: Signer | Provider): ((tokenAddress: string) => VariableDebtToken | null) =>
  (tokenAddress: string) => {
    return VariableDebtToken__factory.connect(tokenAddress, signerOrProvider);
  };

export default variableDebtTokenConnect;
