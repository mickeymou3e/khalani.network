import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { DIAOracleV2 } from '@src/typechain/godwoken/DIAOracleV2';
import { DIAOracleV2__factory } from '@src/typechain/godwoken/factories/DIAOracleV2__factory';
import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { getContractsConfigStatic } from './utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): DIAOracleV2 | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.diaOracle) {
    return null;
  }
  return DIAOracleV2__factory.connect(contractsConfig.diaOracle, signerOrProvider);
}
