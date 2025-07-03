import prompts from 'prompts';

import { Cli } from '@src/types';

import { TOKENS_CLI_COMMANDS } from '@cli/types';
import { balanceCli } from './balance';
import { list } from './list';
import { mintCli } from './mint';
import { transferCli } from './transfer';

export const TokensCli: Cli = async ({ environment, parentCli }) => {
  const choices = [
    { title: TOKENS_CLI_COMMANDS.balance.toString(), value: TOKENS_CLI_COMMANDS.balance },
    { title: TOKENS_CLI_COMMANDS.list.toString(), value: TOKENS_CLI_COMMANDS.list },
    { title: TOKENS_CLI_COMMANDS.transfer.toString(), value: TOKENS_CLI_COMMANDS.transfer },
  ];
  if (environment.env !== 'mainnet') {
    choices.push({ title: TOKENS_CLI_COMMANDS.mint.toString(), value: TOKENS_CLI_COMMANDS.mint });
  }
  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select action',
      choices,
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  switch (action) {
    case TOKENS_CLI_COMMANDS.mint:
      await mintCli(environment);
      break;
    case TOKENS_CLI_COMMANDS.balance:
      await balanceCli(environment);
      break;
    case TOKENS_CLI_COMMANDS.transfer:
      await transferCli(environment);
      break;
    case TOKENS_CLI_COMMANDS.list:
      await list(environment);
      break;
  }

  return TokensCli({ environment, parentCli });
};
