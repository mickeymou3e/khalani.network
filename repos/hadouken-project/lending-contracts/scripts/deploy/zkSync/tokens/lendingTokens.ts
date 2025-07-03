import { writeToContractsConfig } from '@scripts/filesManager';
import { LendingPool__factory } from '@src/typechain/zksync';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { delay, getConfigInstant, getContractsConfigInstant } from '@src/utils';
import { Tokens } from '@src/types/types';
import { Contract } from 'ethers';

export async function updateZkSyncLendingTokensConfig(
  environment: ZkSyncDeploymentEnvironment
): Promise<Tokens> {
  const { chainId, env, walletWithProvider } = environment;

  const contractsConfig = getContractsConfigInstant(chainId, env, true);
  const config = getConfigInstant(chainId, env, true);

  const delayTime = Number(config?.delay);

  if (!contractsConfig?.lendingPoolProxy) throw new Error('LendingPoolProxy not found');

  const pool = new Contract(
    contractsConfig.lendingPoolProxy,
    LendingPool__factory.abi,
    walletWithProvider
  );

  let lendingTokens: Tokens = {};

  const deployedTokens = contractsConfig.tokens;
  for (const token in deployedTokens) {
    const tokenAddress = deployedTokens[token].address;
    await delay(delayTime);
    const data = await pool?.getReserveData(tokenAddress);
    const deployedTokenAddresses = {
      address: tokenAddress,
      aTokenAddress: data?.aTokenAddress,
      stableDebtTokenAddress: data?.stableDebtTokenAddress,
      variableDebtTokenAddress: data?.variableDebtTokenAddress,
    };
    lendingTokens[token] = deployedTokenAddresses;
  }
  writeToContractsConfig(
    {
      tokens: lendingTokens,
    },
    environment.chainId,
    environment.env,
    environment.networkName
  );

  return lendingTokens;
}
