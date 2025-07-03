import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';

import { UiPoolDataProvider__factory } from '@src/typechain/godwoken/factories/UiPoolDataProvider__factory';
import type { UiPoolDataProvider } from '@src/typechain/godwoken/UiPoolDataProvider';

import { getConnectConfig } from '@src/utils/utils';

export const uiHelperConnect = (
  chainId: string,
  signerOrProvider: Signer | Provider,
  runTime: boolean = false
): UiPoolDataProvider | null => {
  const contractsConfig = getConnectConfig(chainId, runTime);

  if (!contractsConfig.UIHelper) throw Error('UIHelper address not found');

  return UiPoolDataProvider__factory.connect(contractsConfig.UIHelper, signerOrProvider);
};

export default uiHelperConnect;
