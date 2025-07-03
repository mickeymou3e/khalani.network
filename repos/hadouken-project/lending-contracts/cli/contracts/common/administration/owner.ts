import { OWNER_CLI_COMMANDS } from '@cli/types';
import { connectToContractsRuntime } from '@scripts/connect';
import { Cli } from '@src/types';
import { getConfigInstant } from '@src/utils';
import { ethers } from 'ethers';
import prompts from 'prompts';
import { sendGnosisSafeTransaction } from '../gnosisSafe';

export const OwnerCli: Cli = async ({ environment, parentCli }) => {
  const config = getConfigInstant(environment.chainId, environment.env);
  if (!config) throw Error('config not found');
  const addressProvider = connectToContractsRuntime(environment).addressProvider;

  if (!addressProvider) throw Error('addressProvider not found');

  const { action: poolOwnerActions } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        { title: `${OWNER_CLI_COMMANDS.getOwner.toString()}`, value: OWNER_CLI_COMMANDS.getOwner },
        {
          title: `${OWNER_CLI_COMMANDS.setOwner.toString()} (Gnosis support)`,
          value: OWNER_CLI_COMMANDS.setOwner,
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (poolOwnerActions === OWNER_CLI_COMMANDS.getOwner) {
    const owner = await addressProvider.owner();
    console.log('Pool Owner:', owner);
  } else if (poolOwnerActions === OWNER_CLI_COMMANDS.setOwner) {
    const isGnosisSafe = config.isGnosisSafe;
    const previousOwner = await addressProvider.owner();
    const { newOwner } = await prompts(
      {
        type: 'text',
        name: 'newOwner',
        message: `New Pool Owner address: (previous: ${previousOwner.toString()})`,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    if (ethers.utils.isAddress(newOwner)) {
      if (isGnosisSafe && previousOwner === config.gnosisSafe) {
        const functionData = addressProvider.interface.encodeFunctionData('transferOwnership', [
          newOwner,
        ]);

        await sendGnosisSafeTransaction(environment, addressProvider.address, functionData);
      } else {
        const transaction = await addressProvider.transferOwnership(newOwner);
        await transaction.wait();
      }
    } else {
      console.log('Eth address not valid');
    }
  }
};
