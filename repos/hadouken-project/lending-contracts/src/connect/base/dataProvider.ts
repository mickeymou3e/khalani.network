import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { AaveProtocolDataProvider } from '@src/typechain/godwoken/AaveProtocolDataProvider';
import { AaveProtocolDataProvider__factory } from '@src/typechain/godwoken/factories/AaveProtocolDataProvider__factory';
import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { getContractsConfigStatic } from './utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): AaveProtocolDataProvider | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.dataProvider) {
    return null;
  }

  return AaveProtocolDataProvider__factory.connect(contractsConfig.dataProvider, signerOrProvider);
}
