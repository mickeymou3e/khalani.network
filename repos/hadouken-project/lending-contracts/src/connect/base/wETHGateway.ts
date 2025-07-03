import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { WETHGateway } from '@src/typechain/godwoken/WETHGateway';
import { WETHGateway__factory } from '@src/typechain/godwoken/factories/WETHGateway__factory';

import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { getContractsConfigStatic } from './utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): WETHGateway | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.wEthGateway) {
    return null;
  }

  return WETHGateway__factory.connect(contractsConfig.wEthGateway, signerOrProvider);
}
