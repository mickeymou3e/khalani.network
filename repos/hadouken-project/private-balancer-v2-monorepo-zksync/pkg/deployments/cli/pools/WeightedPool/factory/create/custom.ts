import { BigNumber } from 'ethers';
import { network } from 'hardhat';
import prompts from 'prompts';

import { WeightedPool__factory } from '@balancer-labs/typechain';
import chalk from 'chalk';
import { save } from '../../../../../src/utils';
import { Cli, Output } from '../../../../types';
import joinCli from '../../../../Vault/join/cli';
import create from './create';
import { WeightedPoolFactoryCreateParameters } from './types';

export const WeightedPoolCustomCreateCli: Cli = async ({ environment, parentCli }) => {
  const deployer = environment.deployer;

  const optionsExit = {
    onCancel: () => {
      return parentCli ? parentCli({ environment }) : process.exit(0);
    },
  };

  const { name } = await prompts(
    {
      type: 'text',
      name: 'name',
      message: 'name',
    },
    optionsExit
  );
  const { symbol } = await prompts(
    {
      type: 'text',
      name: 'symbol',
      message: 'symbol',
    },
    optionsExit
  );

  const tokensDesc: {
    token: string;
    weight: string;
    rateProvider: string;
  }[] = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { addToken } = await prompts(
      {
        type: 'confirm',
        name: 'addToken',
        message: 'add token',
      },
      optionsExit
    );
    if (!addToken) break;

    const { token } = await prompts(
      {
        type: 'text',
        name: 'token',
        message: 'token',
      },
      optionsExit
    );

    const { weight } = await prompts(
      {
        type: 'number',
        name: 'weight',
        message: 'weight',
      },
      optionsExit
    );

    const { rateProvider } = await prompts(
      {
        type: 'text',
        name: 'rateProvider',
        message: 'rateProvider',
      },
      optionsExit
    );

    tokensDesc.push({
      token,
      rateProvider,
      weight,
    });
  }

  const sortedTokensDesc = tokensDesc.sort((a, b) => {
    if (a.token === b.token) {
      return 0;
    } else {
      return a.token < b.token ? -1 : 1;
    }
  });
  const tokens = sortedTokensDesc.map(({ token }) => token);
  const rateProviders = sortedTokensDesc.map(({ rateProvider }) => rateProvider);
  const weights = sortedTokensDesc
    .map((weightedToken) => weightedToken.weight)
    .map((weight) => BigNumber.from(weight).mul(BigNumber.from(10)).pow(18).div(100));

  const swapFeePercentageTransform = (swapFeePercentage: number) =>
    BigNumber.from(swapFeePercentage).mul(BigNumber.from(10).pow(12));

  const { swapFeePercentage } = await prompts(
    {
      type: 'number',
      name: 'swapFeePercentage',
      message: 'swapFeePercentage([1, 10000] -> [0.0001 ,10])',
      validate: (swapFeePercentage) => {
        const swapFeePercentageBN = swapFeePercentageTransform(swapFeePercentage);

        return (
          swapFeePercentageBN.gte(BigNumber.from(10).pow(12)) && swapFeePercentageBN.lte(BigNumber.from(10).pow(17))
        );
      },
    },
    optionsExit
  );

  const { delegate } = await prompts(
    {
      type: 'text',
      name: 'delegate',
      message: 'delegate',
    },
    optionsExit
  );

  const output = await create({
    name,
    symbol,
    tokens,
    weights,
    rateProviders,
    swapFeePercentage: BigNumber.from(swapFeePercentageTransform(swapFeePercentage)),
    delegate,
    initialLiquidity: {},
  });

  if (output) {
    if (output) {
      save<Output<WeightedPoolFactoryCreateParameters, string>>(output, symbol, __dirname, network.name);

      const pool = WeightedPool__factory.connect(output?.data['WeightedPoolFactory'].create.output, deployer);
      const vaultAddress = await pool.getVault();

      console.log(chalk.bgYellow(chalk.black('add initial balance')));
      await joinCli(vaultAddress, pool.address);
    }
  }

  return WeightedPoolCustomCreateCli({ environment, parentCli });
};
