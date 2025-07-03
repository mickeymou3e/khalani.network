import prompts from 'prompts';
import { network } from 'hardhat';
import { BigNumber } from 'ethers';

import create from './create';

import { save } from '../../../../../src/utils';
import { Cli, Output } from '../../../../types';

import { ComposableStablePoolFactoryCreateParameters } from './types';
import { WeightedPool__factory } from '@balancer-labs/typechain';
import joinCli from '../../../../Vault/join/cli';
import chalk from 'chalk';

export const ComposableStablePoolCustomCreateCli: Cli = async (cliProps) => {
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

  const tokensDesc: {
    token: string;
    rateProvider: string;
    priceRateCacheDuration: number;
    exemptFromYieldProtocolFee: boolean;
  }[] = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { addToken } = await prompts({
      type: 'confirm',
      name: 'addToken',
      message: 'add token',
    });
    if (!addToken) break;

    const { token } = await prompts({
      type: 'text',
      name: 'token',
      message: 'token',
    });
    const { rateProvider } = await prompts({
      type: 'text',
      name: 'rateProvider',
      message: 'rateProvider',
    });
    const { priceRateCacheDuration } = await prompts({
      type: 'text',
      name: 'priceRateCacheDuration',
      message: 'priceRateCacheDuration',
    });
    const { exemptFromYieldProtocolFee } = await prompts({
      type: 'confirm',
      name: 'exemptFromYieldProtocolFee',
      message: 'exemptFromYieldProtocolFee',
    });

    tokensDesc.push({
      token,
      rateProvider,
      priceRateCacheDuration,
      exemptFromYieldProtocolFee,
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
  const priceRateCacheDuration = sortedTokensDesc.map(({ priceRateCacheDuration }) => priceRateCacheDuration);
  const exemptFromYieldProtocolFeeFlags = sortedTokensDesc.map(
    ({ exemptFromYieldProtocolFee }) => exemptFromYieldProtocolFee
  );

  const swapFeePercentageTransform = (swapFeePercentage: number) =>
    BigNumber.from(swapFeePercentage).mul(BigNumber.from(10).pow(12));

  const { swapFeePercentage } = await prompts({
    type: 'number',
    name: 'swapFeePercentage',
    message: 'swapFeePercentage([1, 10000] -> [0.0001 ,10])',
    validate: (swapFeePercentage) => {
      const swapFeePercentageBN = swapFeePercentageTransform(swapFeePercentage);

      return swapFeePercentageBN.gte(BigNumber.from(10).pow(12)) && swapFeePercentageBN.lte(BigNumber.from(10).pow(17));
    },
  });
  const { amplificationParameter } = await prompts({
    type: 'number',
    name: 'amplificationParameter',
    message: 'amplificationParameter',
  });

  const { owner } = await prompts({
    type: 'text',
    name: 'owner',
    message: 'owner',
  });

  const output = await create({
    name,
    symbol,
    tokens,
    rateProviders,
    priceRateCacheDuration,
    amplificationParameter: BigNumber.from(amplificationParameter),
    swapFeePercentage: BigNumber.from(swapFeePercentageTransform(swapFeePercentage)),
    exemptFromYieldProtocolFeeFlags,
    owner,
    initialLiquidity: {},
  });

  if (output) {
    save<Output<ComposableStablePoolFactoryCreateParameters, string>>(output, symbol, __dirname, network.name);

    const pool = WeightedPool__factory.connect(output?.data['ComposableStablePoolFactory'].create.output, deployer);
    const vaultAddress = await pool.getVault();

    console.log(chalk.bgYellow(chalk.black('add initial balance')));
    await joinCli(vaultAddress, pool.address);
  }
};
