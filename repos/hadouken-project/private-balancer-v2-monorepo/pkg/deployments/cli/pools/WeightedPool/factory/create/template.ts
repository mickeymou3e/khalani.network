import { promises as fs } from 'fs';
import path from 'path';
import prompts from 'prompts';

import { WeightedPool__factory } from '@hadouken-project/typechain';
import chalk from 'chalk';
import { BigNumber, BigNumberish } from 'ethers';
import { balanceOf } from '../../../../ERC20/balanceOf';
import { Cli, Output } from '../../../../types';
import { initJoin } from '../../../../Vault/join/init';
import create from './create';
import { WeightedPoolFactoryCreateParameters } from './types';
import { save } from '../../../../utils/save';

const INPUT_DIR = path.resolve(__dirname, './templates');

export const WeightedPoolTemplateCreateCli: Cli = async ({ environment, parentCli }) => {
  const deployer = environment.deployer;
  const deployerAddress = await deployer.getAddress();

  const optionsExit = {
    onCancel: () => {
      return parentCli ? parentCli({ environment: environment }) : process.exit(0);
    },
  };

  try {
    const fileNames = await fs.readdir(INPUT_DIR);

    const { template } = await prompts(
      {
        type: 'select',
        name: 'template',
        message: 'select pool template',
        choices: fileNames
          .filter((fileName) => fileName.includes(environment.network))
          .map((fileName) => ({
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
        return WeightedPoolTemplateCreateCli({ environment, parentCli });
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
      environment: environment,
    };

    const output = await create(createParameters);

    if (output) {
      save<Output<Omit<WeightedPoolFactoryCreateParameters, 'environment'>, string>>(
        output,
        input.symbol,
        __dirname,
        environment.network
      );

      const pool = WeightedPool__factory.connect(output?.data['WeightedPoolFactory'].create.output, deployer);
      console.log(chalk.green('WeightedPool deployed at'), chalk.bgGreen(chalk.black(pool.address)));

      console.log(chalk.bgYellow(chalk.black('add initial balance')));

      const vaultAddress = await pool.getVault();

      await initJoin(environment, vaultAddress, pool.address, input.initialLiquidity);
    }
  } catch (error) {
    console.error('error', error);
  }
  return WeightedPoolTemplateCreateCli({ environment, parentCli });
};
