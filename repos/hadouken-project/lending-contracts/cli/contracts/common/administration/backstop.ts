import { getTokenList } from '@scripts/filesManager';
import prompts from 'prompts';

import { BACKSTOP_CLI_COMMANDS } from '@cli/types';
import { connectToContractsRuntime } from '@scripts/connect';
import { Cli } from '@src/types';
import { getConfigInstant } from '@src/utils';
import { sendGnosisSafeTransaction } from '../gnosisSafe';

export const AdminBackstopCli: Cli = async ({ environment, parentCli }) => {
  const config = getConfigInstant(environment.chainId, environment.env);
  if (!config) throw Error('config not found');
  const lendingPool = connectToContractsRuntime(environment).pool;
  const poolConfigurator = connectToContractsRuntime(environment).poolConfiguration;

  if (!lendingPool) throw Error('lendingPool not found');
  if (!poolConfigurator) throw Error('poolConfigurator not found');

  const erc20list = getTokenList(environment);

  const { address } = await prompts(
    {
      type: 'select',
      name: 'address',
      message: 'Balance',
      choices: [
        ...erc20list.map(({ address, symbol }) => ({
          value: address,
          title: `${address} (${symbol})`,
        })),
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  const { action: BProtocolActions } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        {
          title: BACKSTOP_CLI_COMMANDS.getBackstop.toString(),
          value: BACKSTOP_CLI_COMMANDS.getBackstop,
        },
        {
          title: `${BACKSTOP_CLI_COMMANDS.setBackstop.toString()} (Gnosis support)`,
          value: BACKSTOP_CLI_COMMANDS.setBackstop,
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (BProtocolActions === BACKSTOP_CLI_COMMANDS.getBackstop) {
    const BProtocol = await lendingPool.getBProtocol(address);
    console.log('Backstop address:', BProtocol);
  } else if (BProtocolActions === BACKSTOP_CLI_COMMANDS.setBackstop) {
    const { newBProtocol } = await prompts(
      {
        type: 'text',
        name: 'newBProtocol',
        message: `New Backstop address:`,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    const isGnosisSafe = config.isGnosisSafe;

    if (isGnosisSafe) {
      const functionData = poolConfigurator.interface.encodeFunctionData('setBProtocol', [
        address,
        newBProtocol,
      ]);

      await sendGnosisSafeTransaction(environment, poolConfigurator.address, functionData);
      console.log('Backstop request to gnosis safe');
    } else {
      const BProtocol = await (await poolConfigurator.setBProtocol(address, newBProtocol)).wait(2);
      console.log('Backstop set to:', BProtocol.contractAddress);
    }
  }
};
