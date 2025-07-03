import { tokenSelectorCli } from '@cli/commands/prompt';
import { deploySingleTestToken, deployTestTokens } from '@scripts/deploy';

import { formatToken, formatTokens, writeToContractsConfig } from '@scripts/filesManager';
import { CliProps, ScriptRunEnvironment } from '@src/types';
import { delay, getConfigInstant, getContractsConfigInstant } from '@src/utils';
import { BigNumber } from 'ethers';

export type tokenCliProps = (props: CliProps, deployAll?: boolean) => Promise<void>;

const INITIAL_BALANCE = '100000000000000000000000000';

export const deployUnderlyingTokensCli: tokenCliProps = async ({ environment }, deployAll) => {
  console.log('deploy underlying tokens tokens');
  if (deployAll) {
    await tokenDeployHandler('all', environment);
    return;
  }

  const config = getConfigInstant(environment.chainId, environment.env);
  if (!config) throw Error('config not found');
  if (!config.tokens) {
    console.error('No tokens in config file!');
    return;
  }

  const token = await tokenSelectorCli(environment);
  if (!token) throw Error('token not defined');

  await tokenDeployHandler(token.symbol, environment);
};

const tokenDeployHandler = async (tokenSymbol: string, environment: ScriptRunEnvironment) => {
  const config = getConfigInstant(environment.chainId, environment.env);
  const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);
  if (!contractsConfig) throw Error('configContracts not found');
  if (config) {
    switch (tokenSymbol) {
      case 'all': {
        if (environment.env === 'testnet' || environment.env === 'localhost') {
          await deployTestTokens(environment);

          await delay(environment.delayInMs);
          return;
        }

        if (config.tokens) {
          const formattedTokens = formatTokens(config.tokens);

          await writeToContractsConfig(
            { tokens: formattedTokens },
            environment.chainId,
            environment.env,
            environment.networkName
          );
          console.log(`Deployed tokens`);
        } else {
          console.error('Warning, no tokens in config file!');
        }
        break;
      }
      default: {
        const token = config.tokens?.find((token) => token.symbol === tokenSymbol);
        if (environment.env === 'testnet' || environment.env === 'localhost') {
          if (!token) {
            console.error('Error! Token is absent in config.json');
            return;
          }
          const deployedToken = await deploySingleTestToken(
            environment,
            environment.address,
            token.name || '',
            token.symbol,
            BigNumber.from(token.initialValue || INITIAL_BALANCE),
            token.decimals || 18
          );
          const formattedToken = formatToken(deployedToken);
          const newTokens = {
            ...contractsConfig.tokens,
            ...formattedToken,
          };
          await writeToContractsConfig(
            { tokens: newTokens },
            environment.chainId,
            environment.env,
            environment.networkName
          );
          await delay(environment.delayInMs);
          return;
        }
        if (token) {
          const formattedToken = formatToken(token);
          const newTokens = { ...contractsConfig.tokens, ...formattedToken };
          await writeToContractsConfig(
            { tokens: newTokens },
            environment.chainId,
            environment.env,
            environment.networkName
          );
          console.log(`Deployed tokens`);
        } else {
          console.error('Warning, no tokens in config file!');
        }
        break;
      }
    }
  }
};
