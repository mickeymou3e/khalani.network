import prompts from 'prompts';
import chalk from 'chalk';

import { Cli } from '../../types';

import mint from './mint';
import { BigNumber } from 'ethers';

import tokensJSON from '../tokens.json';

const mintCli: Cli = async (cliProps) => {
  console.log(chalk.bgGreen(chalk.black(`TestToken mint cli`)));
  const deployer = cliProps.environment.deployer;
  const deployerAddress = await deployer.getAddress();
  const { tokenAddress } = await prompts({
    type: 'text',
    name: 'tokenAddress',
    message: 'token address',
    initial: 'all',
  });

  const { recipientAddress } = await prompts({
    type: 'text',
    name: 'recipientAddress',
    message: 'recipient address',
    initial: deployerAddress,
  });

  const { amount } = await prompts({
    type: 'text',
    name: 'amount',
    message: 'amount',
  });

  if (tokenAddress === 'all') {
    const tokens: {
      name: string;
      symbol: string;
      decimals: number;
      address: string;
    }[] = tokensJSON;

    for (const token of tokens) {
      const balance = await mint(token.address, recipientAddress, BigNumber.from(amount), deployer);
      console.log(
        `Token ${chalk.bgYellow(chalk.black(token.address))} balanceOf ${chalk.bgYellow(
          chalk.black(recipientAddress)
        )}`,
        chalk.yellow(balance.toString())
      );
    }
  } else {
    const balance = await mint(tokenAddress, recipientAddress, BigNumber.from(amount), deployer);
    console.log(
      `Token ${chalk.bgYellow(chalk.black(tokenAddress))} balanceOf ${chalk.bgYellow(chalk.black(recipientAddress))}`,
      chalk.yellow(balance.toString())
    );
  }

  return mintCli(cliProps);
};

export default mintCli;
