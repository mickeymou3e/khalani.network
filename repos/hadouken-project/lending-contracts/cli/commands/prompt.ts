import { ScriptRunEnvironment } from '@src/types';
import { Tokens } from '@src/types/types';
import { getContractsConfigInstant } from '@src/utils';
import prompts from 'prompts';

export const tokenSelectorCli = async (
  scriptEnv: ScriptRunEnvironment,
  customTokens?: Tokens,
  withAll?: boolean
): Promise<{ symbol: string; address: string } | null> => {
  const contractsConfig = getContractsConfigInstant(scriptEnv.chainId, scriptEnv.env, true);
  if (!contractsConfig) throw Error('contractsConfig is empty');
  const configTokens = contractsConfig.tokens ?? {};

  const tokens: Tokens = customTokens ?? configTokens;

  const symbols: string[] = Object.keys(tokens);

  const choices = symbols.map((symbol) => ({
    value: {
      address: tokens[symbol].address,
      symbol: symbol,
    },
    title: `(${symbol})`,
  }));

  if (withAll) {
    choices.push({ value: { address: 'all', symbol: 'all' }, title: 'all' });
  }

  const { token } = await prompts(
    {
      type: 'select',
      name: 'token',
      message: 'Select Token',
      choices,
    },
    {
      onCancel: () => {
        return null;
      },
    }
  );

  return token;
};

export const amountSelectorCli = async (title: string): Promise<number | null> => {
  const { amount } = await prompts(
    {
      type: 'text',
      name: 'amount',
      message: title ?? 'Provide amount',
    },
    {
      onCancel: () => {
        return null;
      },
    }
  );

  return amount as number;
};
