import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { UiPoolDataProvider } from '@src/typechain/godwoken/UiPoolDataProvider';
import { UiPoolDataProvider__factory } from '@src/typechain/godwoken/factories/UiPoolDataProvider__factory';

import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { getContractsConfigStatic } from './utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): UiPoolDataProvider | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.UIHelper) {
    return null;
  }
  return UiPoolDataProvider__factory.connect(contractsConfig.UIHelper, signerOrProvider);
}
