import { promises as fs } from 'fs';
import path from 'path';
import prompts from 'prompts';

import create from './create';
import { WeightedPoolFactoryCreateParameters } from './types';
import { Cli, Output } from '../../../../types';
import { save } from '../../../../../src/utils';
import { network } from 'hardhat';
import { BigNumber, BigNumberish } from 'ethers';
import { WeightedPool__factory } from '@balancer-labs/typechain';
import chalk from 'chalk';
import { initJoin } from '../../../../Vault/join/init';
import { balanceOf } from '../../../../ERC20/balanceOf';

const INPUT_DIR = path.resolve(__dirname, './templates');

export const WeightedPoolTemplateCreateCli: Cli = async (cliProps) => {
  const deployer = cliProps.environment.deployer;
  const deployerAddress = await deployer.getAddress();

  const optionsExit = {
    onCancel: () => {
      return cliProps.parentCli ? cliProps.parentCli(cliProps) : process.exit(0);
    },
  };

  try {
    const fileNames = await fs.readdir(INPUT_DIR);

    const { template } = await prompts(
      {
        type: 'select',
        name: 'template',
        message: 'select pool template',
        choices: fileNames.map((fileName) => ({
          title: fileName.split('.')[0],
          value: fileName,
        })),
      },
      optionsExit
    );

    const filePath = path.resolve(INPUT_DIR, template);
    const data = await fs.readFile(filePath, 'utf8');
    const input: WeightedPoolFactoryCreateParameters = JSON.parse(data);

    for (const tokenAddress of Object.keys(input.initialLiquidity)) {
      const initialLiquidity = input.initialLiquidity[tokenAddress];
      const balance = await balanceOf(tokenAddress, deployerAddress, deployer);

      if (balance.lt(BigNumber.from(initialLiquidity))) {
        console.error(
          chalk.red('Balance not sufficient', 'liquidity', initialLiquidity, 'balance', balance.toString())
        );
        return WeightedPoolTemplateCreateCli(cliProps);
      }
    }
    const tokensData: {
      token: string;
      weight: BigNumberish;
      rateProvider: string;
    }[] = [];

    for (let index = 0; index < input.tokens.length; index++) {
      tokensData.push({
        token: input.tokens[index],
        weight: input.weights[index],
        rateProvider: input.rateProviders[index],
      });
    }
    const sortedTokensData = tokensData.sort((a, b) => {
      if (a.token === b.token) {
        return 0;
      } else {
        return a.token < b.token ? -1 : 1;
      }
    });

    const createParameters: WeightedPoolFactoryCreateParameters = {
      ...input,
      tokens: sortedTokensData.map(({ token }) => token),
      weights: sortedTokensData.map(({ weight }) => weight),
      rateProviders: sortedTokensData.map(({ rateProvider }) => rateProvider),
    };

    const output = await create(createParameters);

    if (output) {
      save<Output<WeightedPoolFactoryCreateParameters, string>>(output, input.symbol, __dirname, network.name);

      const pool = WeightedPool__factory.connect(output?.data['WeightedPoolFactory'].create.output, deployer);
      console.log(chalk.green('WeightedPool deployed at'), chalk.bgGreen(chalk.black(pool.address)));

      console.log(chalk.bgYellow(chalk.black('add initial balance')));

      const vaultAddress = await pool.getVault();

      await initJoin(vaultAddress, pool.address, input.initialLiquidity);
    }

    return WeightedPoolTemplateCreateCli(cliProps);
  } catch (error) {
    console.error('error', error);
  }
};
