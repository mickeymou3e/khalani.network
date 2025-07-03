import prompts from 'prompts';

import { Cli } from '../../../../types';

import { AaveLinearPool__factory } from '@hadouken-project/typechain';
import swapCli from '../../../../Vault/swap/cli';

export const AddTokensCli: Cli = async (cliProps) => {
  const deployer = cliProps.environment.deployer;

  const optionsExit = {
    onCancel: () => {
      return cliProps.parentCli ? cliProps.parentCli(cliProps) : process.exit(0);
    },
  };

  const { address } = await prompts(
    {
      type: 'text',
      name: 'address',
      message: 'AaveLinearPool address',
    },
    optionsExit
  );

  const pool = AaveLinearPool__factory.connect(address, deployer);
  const vaultAddress = await pool.getVault();

  await swapCli(vaultAddress, pool.address);
};
