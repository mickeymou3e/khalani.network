import prompts from 'prompts';
import chalk from 'chalk';

import { Cli, Output } from '../../types';

import deploy from './deploy';
import { save } from '../../../src/utils';
import { network } from 'hardhat';

const deployCli: Cli = async (cliProps) => {
  console.log(cliProps.environment.network);
  const deployer = cliProps.environment.deployer;

  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: 'name',
  });

  const { symbol } = await prompts({
    type: 'text',
    name: 'symbol',
    message: 'symbol',
  });

  const { decimals } = await prompts({
    type: 'number',
    name: 'decimals',
    message: 'decimals',
    initial: 18,
  });

  const { address, blockNumber, transactionHash } = await deploy(name, symbol, decimals, deployer);

  console.log(chalk.bgYellow(chalk.black(`TestToken ${symbol} deployed: `)), chalk.yellow(address));

  if (address) {
    save<
      Output<
        {
          name: string;
          symbol: string;
          decimals: number;
        },
        string
      >
    >(
      {
        transaction: {
          hash: transactionHash,
          blockNumber: blockNumber,
        },
        data: {
          TestToken: {
            deploy: {
              input: {
                name: name as string,
                symbol: symbol as string,
                decimals: decimals as number,
              },
              output: address,
            },
          },
        },
      },
      symbol,
      __dirname,
      network.name
    );
  }

  return deployCli(cliProps);
};

export default deployCli;
