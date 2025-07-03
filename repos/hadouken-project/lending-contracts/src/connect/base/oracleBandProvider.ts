import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { BandOracleProvider } from '@src/typechain/godwoken/BandOracleProvider';
import { BandOracleProvider__factory } from '@src/typechain/godwoken/factories/BandOracleProvider__factory';

import { Environments } from '@src/types/types';
import { BaseChain } from '../../types';
import { getContractsConfigStatic } from './utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): BandOracleProvider | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.oracleBrandProvider) {
    return null;
  }

  return BandOracleProvider__factory.connect(contractsConfig.oracleBrandProvider, signerOrProvider);
}
