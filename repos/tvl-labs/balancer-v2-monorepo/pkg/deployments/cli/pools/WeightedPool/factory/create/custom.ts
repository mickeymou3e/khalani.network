import prompts from 'prompts';
import { BigNumber } from 'ethers';
import { network } from 'hardhat';

import create from './create';
import { save } from '../../../../../src/utils';
import { Cli, Output } from '../../../../types';
import { WeightedPoolFactoryCreateParameters } from './types';
import { WeightedPool__factory } from '@balancer-labs/typechain';
import joinCli from '../../../../Vault/join/cli';
import chalk from 'chalk';

export const WeightedPoolCustomCreateCli: Cli = async (cliProps) => {
  const deployer = cliProps.environment.deployer;

  const optionsCancel = {
    onCancel: () => {
      return WeightedPoolCustomCreateCli(cliProps);
    },
  };
  const optionsExit = {
    onCancel: () => {
      return cliProps.parentCli ? cliProps.parentCli(cliProps) : process.exit(0);
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
    optionsCancel
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
      optionsCancel
    );
    if (!addToken) break;

    const { token } = await prompts(
      {
        type: 'text',
        name: 'token',
        message: 'token',
      },
      optionsCancel
    );

    const { weight } = await prompts(
      {
        type: 'number',
        name: 'weight',
        message: 'weight',
      },
      optionsCancel
    );

    const { rateProvider } = await prompts(
      {
        type: 'text',
        name: 'rateProvider',
        message: 'rateProvider',
      },
      optionsCancel
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
    optionsCancel
  );

  const { delegate } = await prompts(
    {
      type: 'text',
      name: 'delegate',
      message: 'delegate',
    },
    optionsCancel
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
};
