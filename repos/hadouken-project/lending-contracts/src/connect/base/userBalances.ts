import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { UserBalances } from '@src/typechain/godwoken/UserBalances';
import { UserBalances__factory } from '@src/typechain/godwoken/factories/UserBalances__factory';

import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { getContractsConfigStatic } from './utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): UserBalances | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.userBalances) {
    return null;
  }

  return UserBalances__factory.connect(contractsConfig.userBalances, signerOrProvider);
}
