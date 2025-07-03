import { ethers } from 'ethers';
import prompts from 'prompts';

import { Cli } from '@src/types';

import { STABLE_AND_VARIABLE_TOKEN_HELPER_CLI_COMMANDS } from '@cli/types';
import { connectToContractsRuntime } from '@scripts/connect';
import { getConfigInstant } from '@src/utils';
import { sendGnosisSafeTransaction } from '../gnosisSafe';

export const AdministrationStableAndVariableTokenHelperCli: Cli = async ({
  environment,
  parentCli,
}) => {
  const stableAndVariableTokenHelper =
    connectToContractsRuntime(environment).stableAndVariableTokenHelper;
  if (!stableAndVariableTokenHelper) throw Error('stableAndVariableTokenHelper not found');

  const title = 'Stable and Variable Token Helper Admin';

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        {
          title: STABLE_AND_VARIABLE_TOKEN_HELPER_CLI_COMMANDS.getOwner.toString(),
          value: STABLE_AND_VARIABLE_TOKEN_HELPER_CLI_COMMANDS.getOwner,
        },
        {
          title: `${STABLE_AND_VARIABLE_TOKEN_HELPER_CLI_COMMANDS.setOwner.toString()} (Gnosis support)`,
          value: STABLE_AND_VARIABLE_TOKEN_HELPER_CLI_COMMANDS.setOwner,
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (action === STABLE_AND_VARIABLE_TOKEN_HELPER_CLI_COMMANDS.getOwner) {
    const owner = await stableAndVariableTokenHelper.owner();
    console.log(`${title}:`, owner);
  } else if (action === STABLE_AND_VARIABLE_TOKEN_HELPER_CLI_COMMANDS.setOwner) {
    const config = getConfigInstant(environment.chainId, environment.env);
    if (!config) throw Error('config not found');
    const isGnosisSafe = config.isGnosisSafe;
    const owner = await stableAndVariableTokenHelper.owner();

    const { newAddress } = await prompts(
      {
        type: 'text',
        name: 'newAddress',
        message: `New ${title} Address: (previous: ${owner.toString()})`,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    if (ethers.utils.isAddress(newAddress)) {
      if (isGnosisSafe) {
        const functionData = stableAndVariableTokenHelper.interface.encodeFunctionData(
          'transferOwnership',
          [newAddress]
        );

        await sendGnosisSafeTransaction(
          environment,
          stableAndVariableTokenHelper.address,
          functionData
        );
      } else {
        await (
          await stableAndVariableTokenHelper.transferOwnership(newAddress, {
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
