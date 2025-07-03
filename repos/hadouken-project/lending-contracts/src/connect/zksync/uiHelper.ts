import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { UiPoolDataProvider } from '@src/typechain/zksync/UiPoolDataProvider';
import { UiPoolDataProvider__factory } from '@src/typechain/zksync/factories/UiPoolDataProvider__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): UiPoolDataProvider | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.UIHelper) {
    return null;
  }

  return UiPoolDataProvider__factory.connect(contractsConfig.UIHelper, signerOrProvider);
}
