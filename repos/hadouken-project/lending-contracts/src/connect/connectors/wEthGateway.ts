import { Provider } from '@ethersproject/providers';
import type { WETHGateway } from '@src/typechain/godwoken/WETHGateway';
import { WETHGateway__factory } from '@src/typechain/godwoken/factories/WETHGateway__factory';

import { getConnectConfig } from '@src/utils/utils';
import { Signer } from 'ethers';

export const wETHGatewayConnect = (
  chainId: string,
  signerOrProvider: Signer | Provider,
  runTime: boolean = false
): WETHGateway | null => {
  const contractsConfig = getConnectConfig(chainId, runTime);
  if (!contractsConfig.wEthGateway) return null;

  return WETHGateway__factory.connect(contractsConfig.wEthGateway, signerOrProvider);
};

export default wETHGatewayConnect;
