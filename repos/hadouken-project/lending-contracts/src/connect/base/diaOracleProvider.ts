import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { DIAOracleProvider } from '@src/typechain/godwoken/DIAOracleProvider';
import { DIAOracleProvider__factory } from '@src/typechain/godwoken/factories/DIAOracleProvider__factory';

import { Environments } from '@src/types/types';
import { BaseChain } from '../../types';
import { getContractsConfigStatic } from './utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): DIAOracleProvider | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.diaOracleProvider) {
    return null;
  }
  return DIAOracleProvider__factory.connect(contractsConfig.diaOracleProvider, signerOrProvider);
}
