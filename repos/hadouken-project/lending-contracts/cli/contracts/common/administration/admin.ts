import { ADMIN_CLI_COMMANDS } from '@cli/types';
import { connectToContractsRuntime } from '@scripts/connect';
import { Cli } from '@src/types';
import { getConfigInstant } from '@src/utils';
import { ethers } from 'ethers';
import prompts from 'prompts';
import { sendGnosisSafeTransaction } from '../gnosisSafe';

export const AdminCli: Cli = async ({ environment, parentCli }) => {
  const config = getConfigInstant(environment.chainId, environment.env);
  if (!config) throw Error('config not found');

  const addressProvider = connectToContractsRuntime(environment).addressProvider;

  if (!addressProvider) throw Error('address provider not found');

  const { action: poolAdminActions } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        {
          title: ADMIN_CLI_COMMANDS.getPoolAdmin.toString(),
          value: ADMIN_CLI_COMMANDS.getPoolAdmin,
        },
        {
          title: `${ADMIN_CLI_COMMANDS.setPoolAdmin.toString()} (Gnosis support)`,
          value: ADMIN_CLI_COMMANDS.setPoolAdmin,
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (poolAdminActions === ADMIN_CLI_COMMANDS.getPoolAdmin) {
    const admin = await addressProvider.getPoolAdmin();
    console.log('Pool Admin:', admin);
  } else if (poolAdminActions === ADMIN_CLI_COMMANDS.setPoolAdmin) {
    const admin = await addressProvider.getPoolAdmin();
    const { newPoolAdmin } = await prompts(
      {
        type: 'text',
        name: 'newPoolAdmin',
        message: `New Pool admin address: (previous: ${admin.toString()})`,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    if (ethers.utils.isAddress(newPoolAdmin)) {
      if (config.isGnosisSafe) {
        const functionData = addressProvider.interface.encodeFunctionData('setPoolAdmin', [
          newPoolAdmin,
        ]);

        await sendGnosisSafeTransaction(environment, addressProvider.address, functionData);
      } else {
        await addressProvider.setPoolAdmin(newPoolAdmin);
      }
    } else {
      console.log('Eth address not valid');
    }
  }
};
