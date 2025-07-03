import { Provider } from '@ethersproject/providers';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '@src/zksync/config';

import { StableAndVariableTokensHelper } from '@src/typechain/zksync/StableAndVariableTokensHelper';
import { StableAndVariableTokensHelper__factory } from '@src/typechain/zksync/factories/StableAndVariableTokensHelper__factory';

import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../../filesManager';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): StableAndVariableTokensHelper | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.stableAndVariableTokensHelper) {
    return null;
  }

  return StableAndVariableTokensHelper__factory.connect(
    contractsConfig.stableAndVariableTokensHelper,
    signerOrProvider
  );
}
