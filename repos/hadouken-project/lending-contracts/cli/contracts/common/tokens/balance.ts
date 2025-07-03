import prompts from 'prompts';

import { balanceOf as balanceOfScript } from '@scripts/helpers/balance';

import { getTokenList } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';

const getTokenBalanceList = async (environment: ScriptRunEnvironment) => {
  const tokens = getTokenList(environment);
  const balances = await Promise.all(
    tokens.map(async (token) => {
      const balance = await balanceOfScript(environment, token.symbol, false);
      return { balance, ...token };
    })
  );
  return balances;
};

export const balanceCli = async (environment: ScriptRunEnvironment) => {
  const erc20list = getTokenList(environment);

  const { symbol } = await prompts({
    type: 'select',
    name: 'symbol',
    message: 'Balance',
    choices: [
      ...erc20list.map(({ address, symbol }) => ({
        value: symbol,
        title: `${address} (${symbol})`,
      })),
      { value: 'all', title: 'all' },
    ],
  });

  await balanceHandler(symbol, environment);
};

export const balanceHandler = async (tokenSymbol: string, environment: ScriptRunEnvironment) => {
  const { env, chainId } = environment;
  const config = getContractsConfigInstant(chainId, env, true);

  if (config) {
    switch (tokenSymbol) {
      case 'all': {
        const tokens = await getTokenBalanceList(environment);
        tokens.forEach((token) => {
          console.log(token.balance?.toString(), `(${token.symbol})`);
        });
        break;
      }
      default: {
        const balance = await balanceOfScript(environment, tokenSymbol, false);

        console.log(balance?.toString(), `(${tokenSymbol})`);

        break;
      }
    }
  }
};
