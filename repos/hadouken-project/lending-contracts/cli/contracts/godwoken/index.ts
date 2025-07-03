import prompts from 'prompts';

import { Cli } from '@src/types';
import { CLI_COMMANDS } from '../../types';
import { AdministrationCli } from '../common/administration';
import { DeployCli } from '../common/deploy';
import OracleCli from '../common/oracle';
import { ReserveCli } from '../common/reserves';
import { TokensCli } from '../common/tokens';
import { LiquidationCli } from '../common/liquidation';

export const contractsCliGodwoken: Cli = async ({ environment }): Promise<void> => {
  const { contract } = await prompts(
    {
      type: 'select',
      name: 'contract',
      message: 'Select contract',
      choices: [
        { title: 'admin', value: CLI_COMMANDS.administration },
        { title: 'tokens', value: CLI_COMMANDS.tokens },
        { title: 'deploy', value: CLI_COMMANDS.deploy },
        { title: 'pool', value: CLI_COMMANDS.pool },
        { title: 'oracle', value: CLI_COMMANDS.oracle },
        { title: 'liquidation', value: CLI_COMMANDS.liquidation },
      ],
    },
    {
      onCancel: () => {
        process.exit(0);
      },
    }
  );

  switch (contract) {
    case CLI_COMMANDS.administration:
      await AdministrationCli({ environment, parentCli: contractsCliGodwoken });
      break;
    case CLI_COMMANDS.tokens:
      await TokensCli({ environment, parentCli: contractsCliGodwoken });
      break;
    case CLI_COMMANDS.pool:
      await ReserveCli({ environment, parentCli: contractsCliGodwoken });
      break;
    case CLI_COMMANDS.oracle:
      await OracleCli({ environment, parentCli: contractsCliGodwoken });
      break;
    case CLI_COMMANDS.deploy:
      await DeployCli({ environment, parentCli: contractsCliGodwoken });
      break;
    case CLI_COMMANDS.liquidation:
      await LiquidationCli({ environment, parentCli: contractsCliGodwoken });
      break;
  }

  return contractsCliGodwoken({ environment });
};
