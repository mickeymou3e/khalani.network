import prompts from 'prompts';

import { Cli } from '@src/types';

import { CLI_COMMANDS_NEW } from '../../types';
import { AdministrationCli } from '../common/administration';
import { DeployCli } from '../common/deploy';
import OracleCli from '../common/oracle';
import { ReserveCli } from '../common/reserves';
import { TokensCli } from '../common/tokens';
import { LiquidationCli } from '../common/liquidation';

export const contractsCliZkSync: Cli = async ({ environment }): Promise<void> => {
  const { contract } = await prompts(
    {
      type: 'select',
      name: 'contract',
      message: 'Select contract',
      choices: [
        {
          title: CLI_COMMANDS_NEW.administration.toString(),
          value: CLI_COMMANDS_NEW.administration,
        },
        { title: CLI_COMMANDS_NEW.oracle.toString(), value: CLI_COMMANDS_NEW.oracle },
        { title: CLI_COMMANDS_NEW.reserves.toString(), value: CLI_COMMANDS_NEW.reserves },
        { title: CLI_COMMANDS_NEW.deploy.toString(), value: CLI_COMMANDS_NEW.deploy },
        { title: CLI_COMMANDS_NEW.tokens.toString(), value: CLI_COMMANDS_NEW.tokens },
        { title: CLI_COMMANDS_NEW.liquidation.toString(), value: CLI_COMMANDS_NEW.liquidation },
      ],
    },
    {
      onCancel: () => {
        process.exit(0);
      },
    }
  );

  switch (contract) {
    case CLI_COMMANDS_NEW.administration:
      await AdministrationCli({ environment, parentCli: contractsCliZkSync });
      break;
    case CLI_COMMANDS_NEW.oracle:
      await OracleCli({ environment, parentCli: contractsCliZkSync });
      break;
    case CLI_COMMANDS_NEW.reserves:
      await ReserveCli({ environment, parentCli: contractsCliZkSync });
      break;
    case CLI_COMMANDS_NEW.tokens:
      await TokensCli({ environment, parentCli: contractsCliZkSync });
      break;
    case CLI_COMMANDS_NEW.deploy:
      await DeployCli({ environment, parentCli: contractsCliZkSync });
      break;
    case CLI_COMMANDS_NEW.liquidation:
      await LiquidationCli({ environment, parentCli: contractsCliZkSync });
      break;
  }

  return contractsCliZkSync({ environment });
};
