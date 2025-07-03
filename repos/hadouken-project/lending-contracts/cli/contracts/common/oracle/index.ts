import { ORACLE_CLI_COMMANDS } from '@cli/types';
import { Cli } from '@src/types';
import prompts from 'prompts';
import { GetPriceCli, UpdatePriceCli } from './price';

const OracleCli: Cli = async ({ environment, parentCli }) => {
  const choices = [
    {
      title: ORACLE_CLI_COMMANDS.getPrice,
      value: ORACLE_CLI_COMMANDS.getPrice.toString(),
    },
  ];

  if (environment.env === 'testnet' || environment.env === 'localhost') {
    choices.push({
      title: ORACLE_CLI_COMMANDS.updatePrice,
      value: ORACLE_CLI_COMMANDS.updatePrice.toString(),
    });
  }

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select Oracle action',
      choices,
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  switch (action) {
    case ORACLE_CLI_COMMANDS.getPrice:
      await GetPriceCli({ environment, parentCli });
      break;
    case ORACLE_CLI_COMMANDS.updatePrice:
      await UpdatePriceCli({ environment, parentCli });

      break;
  }
};

export default OracleCli;
