import { Provider } from '@ethersproject/providers';
import { LendingPoolAddressesProvider } from '@src/typechain/godwoken/LendingPoolAddressesProvider';
import { LendingPoolAddressesProvider__factory } from '@src/typechain/godwoken/factories/LendingPoolAddressesProvider__factory';
import { BaseChain } from '@src/types';
import { Environments } from '@src/types/types';
import { Signer } from 'ethers';
import { getContractsConfigFromNetworkName } from '../../filesManager';
import { getContractsConfigStatic } from '../base/utils';

export default function (
  signerOrProvider: Signer | Provider,
  environment: Environments,
  runTime = false,
  network: BaseChain = 'godwoken'
): LendingPoolAddressesProvider | null {
  let contractsConfig = null;
  if (runTime) {
    contractsConfig = getContractsConfigFromNetworkName(`${network}-${environment}`);
  } else {
    contractsConfig = getContractsConfigStatic(environment, network);
  }

  if (!contractsConfig || !contractsConfig.addressProvider) {
    return null;
  }

  return LendingPoolAddressesProvider__factory.connect(
    contractsConfig.addressProvider,
    signerOrProvider
  );
}
