import { writeToContractsConfig } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { LendingContracts, delay } from '@src/utils';
import { ethers } from 'hardhat';

export const deployBaseWEthGateway = async (
  environment: ScriptRunEnvironment,
  wEth: string
): Promise<string> => {
  const { chainId, env, networkName, delayInMs, deployer } = environment;

  console.log('Deploying WEth Gateway');

  const wEthGatewayFactory = await ethers.getContractFactory(
    LendingContracts.WETHGateway,
    deployer
  );

  const wEthGateway = await wEthGatewayFactory.deploy(wEth);
  const wEthGatewayAddress = wEthGateway.address;

  console.log(`WEth Gateway' deployed: ${wEthGatewayAddress}`);

  await delay(delayInMs);

  writeToContractsConfig(
    {
      wEthGateway: wEthGatewayAddress,
    },
    chainId,
    env,
    networkName
  );

  return wEthGatewayAddress;
};
