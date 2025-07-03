import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { WETHGateway } from '@src/typechain/zksync/WETHGateway';
import { WETHGateway__factory } from '@src/typechain/zksync/factories/WETHGateway__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): WETHGateway | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.wEthGateway) {
    return null;
  }

  return WETHGateway__factory.connect(contractsConfig.wEthGateway, signerOrProvider);
}
