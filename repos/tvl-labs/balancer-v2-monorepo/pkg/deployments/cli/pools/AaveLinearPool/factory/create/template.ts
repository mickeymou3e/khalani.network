import { promises as fs } from 'fs';
import path from 'path';
import prompts from 'prompts';

import create from './create';
import { AaveLinearPoolFactoryCreateParameters } from './types';
import { Cli, Output } from '../../../../types';
import { save } from '../../../../../src/utils';
import { network } from 'hardhat';
import { WeightedPool__factory } from '@balancer-labs/typechain';
import chalk from 'chalk';
import { balanceOf } from '../../../../ERC20/balanceOf';
import { BigNumber } from 'ethers';
import { swap } from '../../../../Vault/swap/swap';

const INPUT_DIR = path.resolve(__dirname, './templates');

export const AaveLinearPoolTemplateCreateCli: Cli = async (cliProps) => {
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
    const input: AaveLinearPoolFactoryCreateParameters = JSON.parse(data);

    for (const tokenAddress of Object.keys(input.initialLiquidity)) {
      const initialLiquidity = input.initialLiquidity[tokenAddress];
      const balance = await balanceOf(tokenAddress, deployerAddress, deployer);

      if (balance.lt(BigNumber.from(initialLiquidity))) {
        console.error(
          chalk.red(
            `${tokenAddress} Balance not sufficient`,
            'liquidity',
            initialLiquidity,
            'balance',
            balance.toString()
          )
        );
        return AaveLinearPoolTemplateCreateCli(cliProps);
      }
    }

    const createParameters: AaveLinearPoolFactoryCreateParameters = {
      ...input,
    };

    const output = await create(createParameters);

    if (output) {
      save<Output<AaveLinearPoolFactoryCreateParameters, string>>(output, input.symbol, __dirname, network.name);

      const pool = WeightedPool__factory.connect(output?.data['AaveLinearPoolFactory'].create.output, deployer);

      console.log(chalk.green('AaveLinearPool deployed at'), chalk.bgGreen(chalk.black(pool.address)));

      console.log(chalk.bgYellow(chalk.black('add initial balance, for LinearPool simple swap to Pool token')));
      const vaultAddress = await pool.getVault();

      for (const tokenAddress of Object.keys(input.initialLiquidity)) {
        const initialLiquidity = input.initialLiquidity[tokenAddress];

        console.log(chalk.bgYellow(chalk.black('swap')), chalk.yellow(tokenAddress), chalk.yellow(pool.address));
        await swap(vaultAddress, pool.address, initialLiquidity, tokenAddress, pool.address, deployer);
      }
    }

    return AaveLinearPoolTemplateCreateCli(cliProps);
  } catch (error) {
    console.error('error', error);
  }
};
