import { writeToContractsConfig } from '@scripts/filesManager';
import { LendingPool__factory } from '@src/typechain/godwoken';
import { ScriptRunEnvironment } from '@src/types';
import { Tokens } from '@src/types/types';
import { delay, getContractsConfigInstant } from '@src/utils';

export const updateTokensConfigCli = async (environment: ScriptRunEnvironment) => {
  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!contractsConfig) throw Error('contractsConfig is empty');
  const pool = LendingPool__factory.connect(contractsConfig.lendingPoolProxy, environment.deployer);

  let lendingTokens: Tokens = {};

  const deployedTokens = contractsConfig.tokens;
  for (const token in deployedTokens) {
    const tokenAddress = deployedTokens[token].address;
    await delay(environment.delayInMs);
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
};
