import { connectToContractsRuntime } from '@scripts/connect';
import { writeToContractsConfig } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { delay, getConfigInstant, getContractsConfigInstant } from '@src/utils';
import { Tokens } from '@src/types/types';

export async function updateBaseLendingTokensConfig(
  environment: ScriptRunEnvironment
): Promise<Tokens> {
  const { chainId, env } = environment;

  const contractsConfig = getContractsConfigInstant(chainId, env, true);
  if (!contractsConfig) throw Error('contractsConfig not found');
  const config = getConfigInstant(chainId, env, true);
  if (!config) throw Error('config not found');
  const delayTime = Number(config.delay);

  const contracts = connectToContractsRuntime(environment);

  const pool = contracts.pool;

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
