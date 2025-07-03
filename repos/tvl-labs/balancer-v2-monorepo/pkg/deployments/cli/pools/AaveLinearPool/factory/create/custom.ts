import prompts from 'prompts';
import { BigNumber } from 'ethers';

import { Cli, Output } from '../../../../types';
import { save } from '../../../../../src/utils';

import create from './create';
import { AaveLinearPoolFactoryCreateParameters } from './types';
import { network } from 'hardhat';
import { AaveLinearPool__factory } from '@balancer-labs/typechain';
import swapCli from '../../../../Vault/swap/cli';
import chalk from 'chalk';

export const AaveLinearPoolCreateCli: Cli = async (cliProps) => {
  const deployer = cliProps.environment.deployer;

  const optionsCancel = {
    onCancel: () => {
      return AaveLinearPoolCreateCli(cliProps);
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

  const { mainToken } = await prompts(
    {
      type: 'text',
      name: 'mainToken',
      message: 'mainToken',
    },
    optionsCancel
  );

  const { wrappedToken } = await prompts(
    {
      type: 'text',
      name: 'wrappedToken',
      message: 'wrappedToken',
    },
    optionsCancel
  );

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
  const { upperTarget } = await prompts(
    {
      type: 'number',
      name: 'upperTarget',
      message: 'upperTarget (1e18)',
    },
    optionsCancel
  );

  const { owner } = await prompts(
    {
      type: 'text',
      name: 'owner',
      message: 'owner',
    },
    optionsCancel
  );

  const output = await create({
    name,
    symbol,
    mainToken,
    wrappedToken,
    upperTarget: BigNumber.from(upperTarget).mul(BigNumber.from(10).pow(18)),
    swapFeePercentage: BigNumber.from(swapFeePercentageTransform(swapFeePercentage)),
    owner,
    initialLiquidity: {},
  });

  if (output) {
    save<Output<AaveLinearPoolFactoryCreateParameters, string>>(output, symbol, __dirname, network.name);

    const pool = AaveLinearPool__factory.connect(output?.data['AaveLinearPoolFactory'].create.output, deployer);
    const vaultAddress = await pool.getVault();

    console.log(chalk.bgYellow(chalk.black('add initial balance, for LinearPool simple swap to Pool token')));
    await swapCli(vaultAddress, pool.address);
  }
};
