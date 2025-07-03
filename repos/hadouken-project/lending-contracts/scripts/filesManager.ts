import { Deployer, ScriptRunEnvironment, ZkSyncDeploymentEnvironment } from '@src/types';
import { getConfigInstant, getContractsConfigInstant } from '@src/utils';
import 'dotenv/config';
import { Wallet, providers } from 'ethers';
import fs from 'fs';
import path from 'path';

import { Config, Environments, IContractsConfig, IToken, Tokens } from '@src/types/types';

export const getDeployer = async (config: Config): Promise<Deployer> => {
  const DEPLOYER_PRIVATE_KEY = config.deployer;

  const provider = new providers.JsonRpcProvider(config.rpcUrl, Number(config.chainId));

  const signer = new Wallet(DEPLOYER_PRIVATE_KEY, provider);

  return signer;
};

export const getTokensFromConfig = (
  environment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment
) => {
  const config = getConfigInstant(environment.chainId, environment.env);
  const contracts = getContractsConfigInstant(environment.chainId, environment.env, true);
  const tokens: IToken[] = [];

  if (contracts?.tokens) {
    const symbols = Object.keys(contracts.tokens);
    for (const symbol of symbols) {
      const token = config?.tokens?.find((x) => x.address === contracts?.tokens[symbol].address);
      const symbolWithoutChainDirection = symbol.split('.')[0];

      tokens.push({
        symbol: symbolWithoutChainDirection,
        displaySymbol: token?.displaySymbol ?? symbolWithoutChainDirection,
        address: contracts?.tokens[symbol].address,
      });
    }
  }

  return tokens;
};

export const writeToContractsConfig = (
  obj: Partial<IContractsConfig>,
  chainId: string,
  env: Environments,
  networkName: string
) => {
  const config = getContractsConfigInstant(chainId, env, true);

  const CONFIG_DIR = `src/deployedContracts/deployedContracts.${networkName}.json`;
  const configPath = path.join(process.cwd(), CONFIG_DIR);

  fs.writeFileSync(configPath, JSON.stringify({ ...config, ...obj }, null, 2));
};

export const writeToConfig = (obj: Partial<Config>, scriptEnv: ScriptRunEnvironment) => {
  const config = getConfigInstant(scriptEnv.chainId, scriptEnv.env);

  const CONFIG_DIR = `src/config/${scriptEnv.networkName}.json`;
  const configPath = path.join(process.cwd(), CONFIG_DIR);

  fs.writeFileSync(configPath, JSON.stringify({ ...config, ...obj }, null, 2));
};

export const getTokenList = (environment: ScriptRunEnvironment) => {
  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);

  if (!contractsConfig) throw Error('getContractsConfigInstant is null');
  return Object.keys(contractsConfig.tokens).map((symbol) => ({
    symbol,
    address: contractsConfig.tokens[symbol].address,
  }));
};

export const formatToken = (token: IToken): Tokens => {
  const formattedToken: Tokens = {};
  formattedToken[token.symbol] = { address: token.address };

  return formattedToken;
};

export const formatTokens = (tokens: IToken[]): Tokens => {
  const formattedTokens: Tokens = {};

  for (let i = 0; i < tokens.length; ++i) {
    const deployedToken = tokens[i];
    formattedTokens[deployedToken.symbol] = {
      address: deployedToken.address,
    };
  }

  return formattedTokens;
};
