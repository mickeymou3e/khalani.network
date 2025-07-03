import { EMERGENCY_CLI_COMMANDS } from '@cli/types';
import { connectToContractsRuntime } from '@scripts/connect';
import { Cli } from '@src/types';
import { getConfigInstant } from '@src/utils';
import { ethers } from 'ethers';
import prompts from 'prompts';
import { sendGnosisSafeTransaction } from '../gnosisSafe';

export const EmergencyCli: Cli = async ({ environment, parentCli }) => {
  const addressProvider = connectToContractsRuntime(environment).addressProvider;

  if (!addressProvider) throw Error('address provider not found');

  const { action: emergencyAdminActions } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        { title: 'Get  Emergency Admin', value: EMERGENCY_CLI_COMMANDS.getEmergency },
        {
          title: 'Set Emergency Admin (Gnosis support)',
          value: EMERGENCY_CLI_COMMANDS.setEmergency,
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (emergencyAdminActions === EMERGENCY_CLI_COMMANDS.getEmergency) {
    const emergencyAdmin = await addressProvider.getEmergencyAdmin();
    console.log('Pool Emergency Admin:', emergencyAdmin);
  } else if (emergencyAdminActions === EMERGENCY_CLI_COMMANDS.setEmergency) {
    const config = getConfigInstant(environment.chainId, environment.env);
    if (!config) throw Error('config not found');
    const isGnosisSafe = config.isGnosisSafe;
    const emergencyAdmin = await addressProvider.getEmergencyAdmin();

    const { newEmergencyAddress } = await prompts(
      {
        type: 'text',
        name: 'newEmergencyAddress',
        message: `New Emergency address: (previous: ${emergencyAdmin.toString()})`,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    if (ethers.utils.isAddress(newEmergencyAddress)) {
      if (isGnosisSafe) {
        const functionData = addressProvider.interface.encodeFunctionData('setEmergencyAdmin', [
          newEmergencyAddress,
        ]);

        await sendGnosisSafeTransaction(environment, addressProvider.address, functionData);
      } else {
        await (
          await addressProvider.setEmergencyAdmin(newEmergencyAddress, {
            gasLimit: config.gasLimit,
            gasPrice: config.gasPrice,
          })
        ).wait();
      }
    } else {
      console.log('Eth address not valid');
    }
  }
};
