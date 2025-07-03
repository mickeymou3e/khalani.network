import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { BandOracleProvider } from '@src/typechain/zksync/BandOracleProvider';
import { BandOracleProvider__factory } from '@src/typechain/zksync/factories/BandOracleProvider__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): BandOracleProvider | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.oracleBrandProvider) {
    return null;
  }
  return BandOracleProvider__factory.connect(contractsConfig.oracleBrandProvider, signerOrProvider);
}
