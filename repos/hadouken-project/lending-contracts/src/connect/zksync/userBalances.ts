import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';

import { UserBalances } from '@src/typechain/zksync/UserBalances';
import { UserBalances__factory } from '@src/typechain/zksync/factories/UserBalances__factory';

import { Environments } from '@src/types/types';
import { getZkSyncContractsConfigStatic } from '../../zksync/config';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false
): UserBalances | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`zksync-${environment}`);
  } else {
    contractsConfig = getZkSyncContractsConfigStatic(environment);
  }

  if (!contractsConfig || !contractsConfig.userBalances) {
    return null;
  }

  return UserBalances__factory.connect(contractsConfig.userBalances, signerOrProvider);
}
