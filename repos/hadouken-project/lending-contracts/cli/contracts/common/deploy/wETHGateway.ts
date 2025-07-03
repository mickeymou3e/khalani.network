import { deployWEthGateway } from '@scripts/deploy';
import { ScriptRunEnvironment } from '@src/types';

export const deployWEthGatewayCli = async (environment: ScriptRunEnvironment, wEth: string) => {
  const wEthAddress = await deployWEthGateway(environment, wEth);

  return wEthAddress;
};
