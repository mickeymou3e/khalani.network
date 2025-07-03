import { Provider } from '@ethersproject/providers';

import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';

import { StableAndVariableTokensHelper } from '@src/typechain/godwoken/StableAndVariableTokensHelper';
import { StableAndVariableTokensHelper__factory } from '@src/typechain/godwoken/factories/StableAndVariableTokensHelper__factory';

import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../../filesManager';
import { getContractsConfigStatic } from '../utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): StableAndVariableTokensHelper | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.stableAndVariableTokensHelper) {
    return null;
  }

  return StableAndVariableTokensHelper__factory.connect(
    contractsConfig.stableAndVariableTokensHelper,
    signerOrProvider
  );
}
