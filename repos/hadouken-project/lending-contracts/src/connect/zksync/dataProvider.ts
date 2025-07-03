import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { AaveProtocolDataProvider } from '@src/typechain/zksync/AaveProtocolDataProvider';
import { AaveProtocolDataProvider__factory } from '@src/typechain/zksync/factories/AaveProtocolDataProvider__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): AaveProtocolDataProvider | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.dataProvider) {
    return null;
  }

  return AaveProtocolDataProvider__factory.connect(contractsConfig.dataProvider, signerOrProvider);
}
