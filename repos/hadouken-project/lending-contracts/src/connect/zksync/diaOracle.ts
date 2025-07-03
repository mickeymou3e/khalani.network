import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { DIAOracleV2 } from '@src/typechain/zksync/DIAOracleV2';
import { DIAOracleV2__factory } from '@src/typechain/zksync/factories/DIAOracleV2__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): DIAOracleV2 | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.diaOracle) {
    return null;
  }

  return DIAOracleV2__factory.connect(contractsConfig.diaOracle, signerOrProvider);
}
