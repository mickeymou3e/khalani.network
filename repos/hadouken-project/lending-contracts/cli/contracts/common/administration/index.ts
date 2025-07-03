import { tokenSelectorCli } from '@cli/commands/prompt';
import { addReserveCli } from '@cli/contracts/zkSync/addReserve';
import { ADMINISTRATION_CLI_COMMANDS } from '@cli/types';
import { Cli } from '@src/types';
import { Tokens } from '@src/types/types';

import { connectToContractsRuntime } from '@scripts/connect';
import { getContractsConfigInstant } from '@src/utils';
import prompts from 'prompts';
import { AdministrationATokenAndRateHelperCli } from './aTokenAndRateHelper';
import { AdminCli } from './admin';
import { AdminBackstopCli } from './backstop';
import { EmergencyCli } from './emergency';
import {
  AdministrationBrandOracleProviderCli,
  AdministrationDiaOracleProviderCli,
  AdministrationHadoukenOracleCli,
} from './oracle';
import { OwnerCli } from './owner';
import { setLendingPoolImplCli } from './poolImplementation';
import { ShutdownCli } from './shutdown';
import { AdministrationStableAndVariableTokenHelperCli } from './stableAndVariableTokensHelper';
import { AdministrationForTreasuryCli } from './treasury';

export const AdministrationCli: Cli = async ({ environment, parentCli }) => {
  const config = getContractsConfigInstant(environment.chainId, environment.env, true);

  if (config) {
    const { action } = await prompts(
      {
        type: 'select',
        name: 'action',
        message: 'Select method',
        choices: [
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.owner.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.owner,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.admin.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.admin,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.emergency.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.emergency,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.shutdown.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.shutdown,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.hadoukenOracle.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.hadoukenOracle,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.diaOracleProvider.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.diaOracleProvider,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.bandOracleProvider.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.bandOracleProvider,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.aTokenAndRateHelper.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.aTokenAndRateHelper,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.backstop.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.backstop,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.stableAndVariableTokenHelper.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.stableAndVariableTokenHelper,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.treasury.toString()} (Gnosis support)`,
            value: ADMINISTRATION_CLI_COMMANDS.treasury,
          },

          {
            title: `${ADMINISTRATION_CLI_COMMANDS.addReserve.toString()}`,
            value: ADMINISTRATION_CLI_COMMANDS.addReserve,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.revision.toString()}`,
            value: ADMINISTRATION_CLI_COMMANDS.revision,
          },
          {
            title: `${ADMINISTRATION_CLI_COMMANDS.setImplementation.toString()}`,
            value: ADMINISTRATION_CLI_COMMANDS.setImplementation,
          },
        ],
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    switch (action) {
      case ADMINISTRATION_CLI_COMMANDS.owner:
        await OwnerCli({ environment, parentCli: AdministrationCli });
        break;
      case ADMINISTRATION_CLI_COMMANDS.admin:
        await AdminCli({ environment, parentCli: AdministrationCli });
        break;
      case ADMINISTRATION_CLI_COMMANDS.emergency:
        await EmergencyCli({ environment, parentCli: AdministrationCli });
        break;
      case ADMINISTRATION_CLI_COMMANDS.shutdown:
        await ShutdownCli({ environment, parentCli: AdministrationCli });
        break;
      case ADMINISTRATION_CLI_COMMANDS.hadoukenOracle:
        await AdministrationHadoukenOracleCli({ environment, parentCli: AdministrationCli });
        break;
      case ADMINISTRATION_CLI_COMMANDS.diaOracleProvider:
        await AdministrationDiaOracleProviderCli({ environment, parentCli: AdministrationCli });
        break;
      case ADMINISTRATION_CLI_COMMANDS.bandOracleProvider:
        await AdministrationBrandOracleProviderCli({ environment, parentCli: AdministrationCli });
        break;
      case ADMINISTRATION_CLI_COMMANDS.aTokenAndRateHelper:
        await AdministrationATokenAndRateHelperCli({ environment, parentCli: AdministrationCli });
        break;
      case ADMINISTRATION_CLI_COMMANDS.backstop:
        await AdminBackstopCli({ environment, parentCli: AdministrationCli });
        break;
      case ADMINISTRATION_CLI_COMMANDS.stableAndVariableTokenHelper:
        await AdministrationStableAndVariableTokenHelperCli({
          environment,
          parentCli: AdministrationCli,
        });
        break;
      case ADMINISTRATION_CLI_COMMANDS.treasury:
        await AdministrationForTreasuryCli({
          environment,
          parentCli: AdministrationCli,
        });
        break;

      case ADMINISTRATION_CLI_COMMANDS.addReserve: {
        const contractsConfig = await getContractsConfigInstant(
          environment.chainId,
          environment.env,
          true
        );

        if (!contractsConfig) throw Error('contractsConfig is empty');

        const tokenSymbolsToDeploy = Object.keys(contractsConfig.tokens).filter((symbol) => {
          return !contractsConfig.tokens[symbol].aTokenAddress;
        });

        const tokensToDeploy = tokenSymbolsToDeploy.reduce((tokens, symbol) => {
          tokens[symbol] = contractsConfig.tokens[symbol];
          return tokens;
        }, {} as Tokens);

        const tokenToDeploy = await tokenSelectorCli(environment, tokensToDeploy);
        if (!tokenToDeploy) throw Error('tokenToDeploy not found');

        await addReserveCli(tokenToDeploy, environment);
        break;
      }
      case ADMINISTRATION_CLI_COMMANDS.revision: {
        const contracts = connectToContractsRuntime(environment);

        const lendingPool = contracts.pool;

        if (!lendingPool) throw new Error('Lending pool not found');

        const revision = await lendingPool.LENDINGPOOL_REVISION();

        console.log('Revision: ', revision.toString()); // revision has 2 decimals 200 === 2

        break;
      }
      case ADMINISTRATION_CLI_COMMANDS.setImplementation: {
        await setLendingPoolImplCli({ environment, parentCli });
        break;
      }
    }
  }
};
