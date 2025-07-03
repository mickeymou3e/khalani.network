import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { DIAOracleProvider } from '@src/typechain/zksync/DIAOracleProvider';
import { DIAOracleProvider__factory } from '@src/typechain/zksync/factories/DIAOracleProvider__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): DIAOracleProvider | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.diaOracleProvider) {
    return null;
  }

  return DIAOracleProvider__factory.connect(contractsConfig.diaOracleProvider, signerOrProvider);
}
