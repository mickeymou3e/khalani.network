import { connectToContractsRuntime } from '@scripts/connect';
import { Cli } from '@src/types';
import prompts from 'prompts';
import { tokenSelectorCli } from '../../../commands/prompt';

export const LiquidationCli: Cli = async ({ environment, parentCli }) => {
  const collateralAsset = await tokenSelectorCli(environment, undefined, true);
  const debtAsset = await tokenSelectorCli(environment, undefined, true);

  const { user } = await prompts(
    {
      type: 'text',
      name: 'user',
      message: `User address:`,
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  const { debtToCover } = await prompts(
    {
      type: 'text',
      name: 'debtToCover',
      message: `Debt to cover:`,
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (!debtAsset || !collateralAsset) throw Error('token not defined');
  const pool = connectToContractsRuntime(environment).pool;
  if (!pool) throw Error('pool not defined');

  const ercSelector = connectToContractsRuntime(environment).token;
  const tokenContract = ercSelector(debtAsset.address);

  await tokenContract.approve(pool.address, debtToCover);

  const transaction = await pool.liquidationCall(
    collateralAsset.address,
    debtAsset.address,
    user,
    debtToCover,
    false,
    { gasLimit: 12_000_000 }
  );
  console.log(transaction);
  const receipt = await transaction?.wait();
  console.log(receipt);
};
