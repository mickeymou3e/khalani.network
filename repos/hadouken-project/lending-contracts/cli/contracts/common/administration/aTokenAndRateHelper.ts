import { A_TOKEN_AND_RATE_HELPER_CLI_COMMANDS } from '@cli/types';
import { connectToContractsRuntime } from '@scripts/connect';
import { Cli } from '@src/types';
import { getConfigInstant } from '@src/utils';
import { ethers } from 'ethers';
import prompts from 'prompts';
import { sendGnosisSafeTransaction } from '../gnosisSafe';

export const AdministrationATokenAndRateHelperCli: Cli = async ({ environment, parentCli }) => {
  const aTokenAndRateHelper = connectToContractsRuntime(environment).aTokenAndRateHelper;
  if (!aTokenAndRateHelper) throw Error('aTokenAndRateHelper not found');

  const title = 'aToken and Rate Helper Admin';

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        {
          title: A_TOKEN_AND_RATE_HELPER_CLI_COMMANDS.getOwner.toString(),
          value: A_TOKEN_AND_RATE_HELPER_CLI_COMMANDS.getOwner,
        },
        {
          title: `${A_TOKEN_AND_RATE_HELPER_CLI_COMMANDS.getOwner.toString()} (Gnosis support)`,
          value: A_TOKEN_AND_RATE_HELPER_CLI_COMMANDS.setOwner,
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (action === A_TOKEN_AND_RATE_HELPER_CLI_COMMANDS.getOwner) {
    const owner = await aTokenAndRateHelper.owner();
    console.log(`${title}:`, owner);
  } else if (action === A_TOKEN_AND_RATE_HELPER_CLI_COMMANDS.setOwner) {
    const config = getConfigInstant(environment.chainId, environment.env);
    const isGnosisSafe = config?.isGnosisSafe;
    const owner = await aTokenAndRateHelper.owner();

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
        const functionData = aTokenAndRateHelper.interface.encodeFunctionData('transferOwnership', [
          newAddress,
        ]);

        await sendGnosisSafeTransaction(environment, aTokenAndRateHelper.address, functionData);
      } else {
        await (
          await aTokenAndRateHelper.transferOwnership(newAddress, {
            gasLimit: config?.gasLimit,
            gasPrice: config?.gasPrice,
          })
        ).wait();
      }
    } else {
      console.log('Eth address not valid');
    }
  }
};
