import { BigNumber } from 'ethers';
import prompts from 'prompts';

import { mint as mintScript } from '@scripts/helpers/mint';

import { tokenSelectorCli } from '@cli/commands/prompt';
import { ScriptRunEnvironment } from '@src/types';
import { getContractsConfigInstant } from '@src/utils';

export const mintCli = async (environment: ScriptRunEnvironment) => {
  const { env, chainId } = environment;
  const config = getContractsConfigInstant(chainId, env, true);

  if (config) {
    const token = await tokenSelectorCli(environment, undefined, true);
    if (!token) throw Error('token not defined');

    if (token.symbol === 'all' && token.address === 'all') {
      await mintAllScript(environment);
    } else {
      const amount = await prompts({
        type: 'number',
        name: 'value',
        message: 'Type amount',
      });
      await mintScript(environment, token.symbol, BigNumber.from(amount.value));
    }
  }
};

const mintAllScript = async (environment: ScriptRunEnvironment) => {
  const tokens = ['USDC', 'USDT', 'ETH'];
  const initValue = BigNumber.from(10000000000);

  tokens.forEach(async (symbol) => {
    await mintScript(environment, symbol, initValue);
  });
};
