import { ADMIN_ORACLE_CLI_COMMANDS } from '@cli/types';
import { connectToContractsRuntime } from '@scripts/connect';
import { Cli } from '@src/types';
import { getConfigInstant } from '@src/utils';
import { ethers } from 'ethers';
import prompts from 'prompts';
import { sendGnosisSafeTransaction } from '../gnosisSafe';

export const AdministrationHadoukenOracleCli: Cli = async ({ environment, parentCli }) => {
  const hadoukenOracle = connectToContractsRuntime(environment).hadoukenOracle;
  if (!hadoukenOracle) throw Error('hadoukenOracle not found');

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        {
          title: ADMIN_ORACLE_CLI_COMMANDS.getHadoukenOracleOwner.toString(),
          value: ADMIN_ORACLE_CLI_COMMANDS.getHadoukenOracleOwner,
        },
        {
          title: `${ADMIN_ORACLE_CLI_COMMANDS.setHadoukenOracleOwner.toString()} (Gnosis support)`,
          value: ADMIN_ORACLE_CLI_COMMANDS.setHadoukenOracleOwner,
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (action === ADMIN_ORACLE_CLI_COMMANDS.getHadoukenOracleOwner) {
    const owner = await hadoukenOracle.owner();
    console.log(`current hadouken oracle owner:`, owner);
  } else if (action === ADMIN_ORACLE_CLI_COMMANDS.setHadoukenOracleOwner) {
    const config = getConfigInstant(environment.chainId, environment.env);
    if (!config) throw Error('config not found');
    const isGnosisSafe = config.isGnosisSafe;
    const owner = await hadoukenOracle.owner();

    const { newAddress } = await prompts(
      {
        type: 'text',
        name: 'newAddress',
        message: `New Hadouken Oracle Address: (previous: ${owner.toString()})`,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    if (ethers.utils.isAddress(newAddress)) {
      if (isGnosisSafe) {
        const functionData = hadoukenOracle.interface.encodeFunctionData('transferOwnership', [
          newAddress,
        ]);

        await sendGnosisSafeTransaction(environment, hadoukenOracle.address, functionData);
      } else {
        await (
          await hadoukenOracle.transferOwnership(newAddress, {
            gasLimit: config.gasLimit,
            gasPrice: config.gasPrice,
          })
        ).wait();
      }
    } else {
      console.log('Eth address not valid');
    }
  }
};

export const AdministrationLendingRateOracleCli: Cli = async ({ environment, parentCli }) => {
  const lendingRateOracle = connectToContractsRuntime(environment).lendingRateOracle;
  if (!lendingRateOracle) throw Error('lendingRateOracle not found');

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        {
          title: ADMIN_ORACLE_CLI_COMMANDS.getLendingRateOracleOwner.toString(),
          value: ADMIN_ORACLE_CLI_COMMANDS.getLendingRateOracleOwner,
        },
        {
          title: `${ADMIN_ORACLE_CLI_COMMANDS.setLendingRateOracleOwner.toString()} (Gnosis support)`,
          value: ADMIN_ORACLE_CLI_COMMANDS.setLendingRateOracleOwner.toString(),
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (action === ADMIN_ORACLE_CLI_COMMANDS.getLendingRateOracleOwner) {
    const owner = await lendingRateOracle.owner();
    console.log(`Lending Rate Oracle owner:`, owner);
  } else if (action === ADMIN_ORACLE_CLI_COMMANDS.setLendingRateOracleOwner) {
    const config = getConfigInstant(environment.chainId, environment.env);
    if (!config) throw Error('config not found');
    const isGnosisSafe = config.isGnosisSafe;
    const owner = await lendingRateOracle.owner();

    const { newAddress } = await prompts(
      {
        type: 'text',
        name: 'newAddress',
        message: `New Lending Rate owner Address: (previous: ${owner.toString()})`,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    if (ethers.utils.isAddress(newAddress)) {
      if (isGnosisSafe) {
        const functionData = lendingRateOracle.interface.encodeFunctionData('transferOwnership', [
          newAddress,
        ]);

        await sendGnosisSafeTransaction(environment, lendingRateOracle.address, functionData);
      } else {
        await (
          await lendingRateOracle.transferOwnership(newAddress, {
            gasLimit: config.gasLimit,
            gasPrice: config.gasPrice,
          })
        ).wait();
      }
    } else {
      console.log('Eth address not valid');
    }
  }
};

export const AdministrationDiaOracleProviderCli: Cli = async ({ environment, parentCli }) => {
  const title = 'Dia oracle provider Admin';

  const diaOracleProvider = connectToContractsRuntime(environment).OracleDiaProvider;
  if (!diaOracleProvider) throw Error('diaOracle not found');

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        {
          title: `Get ${title}`,
          value: ADMIN_ORACLE_CLI_COMMANDS.getDiaOracleProviderOwner,
        },
        {
          title: `Set ${title} (Gnosis support)`,
          value: ADMIN_ORACLE_CLI_COMMANDS.setDiaOracleProviderOwner,
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (action === ADMIN_ORACLE_CLI_COMMANDS.getDiaOracleProviderOwner) {
    const owner = await diaOracleProvider.owner();
    console.log(`${title}:`, owner);
  } else if (action === ADMIN_ORACLE_CLI_COMMANDS.setDiaOracleProviderOwner) {
    const config = getConfigInstant(environment.chainId, environment.env);
    if (!config) throw Error('config not found');
    const isGnosisSafe = config.isGnosisSafe;
    const owner = await diaOracleProvider.owner();

    const { newAddress } = await prompts(
      {
        type: 'text',
        name: 'newAddress',
        message: `New ${title} Address: (previous: ${owner.toString()})`,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    if (ethers.utils.isAddress(newAddress)) {
      if (isGnosisSafe) {
        const functionData = diaOracleProvider.interface.encodeFunctionData('transferOwnership', [
          newAddress,
        ]);

        await sendGnosisSafeTransaction(environment, diaOracleProvider.address, functionData);
      } else {
        await (
          await diaOracleProvider.transferOwnership(newAddress, {
            gasLimit: config.gasLimit,
            gasPrice: config.gasPrice,
          })
        ).wait();
      }
    } else {
      console.log('Eth address not valid');
    }
  }
};

export const AdministrationBrandOracleProviderCli: Cli = async ({ environment, parentCli }) => {
  const title = 'Band oracle provider Admin';
  const bandOracleProvider = connectToContractsRuntime(environment).oracleBandProvider;
  if (!bandOracleProvider) throw Error('bandOracleProvider not found');

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        {
          title: ADMIN_ORACLE_CLI_COMMANDS.getBandOracleProviderOwner.toString(),
          value: ADMIN_ORACLE_CLI_COMMANDS.getBandOracleProviderOwner,
        },
        {
          title: `${ADMIN_ORACLE_CLI_COMMANDS.setBandOracleProviderOwner.toString()} (Gnosis support)`,
          value: ADMIN_ORACLE_CLI_COMMANDS.setBandOracleProviderOwner,
        },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (action === ADMIN_ORACLE_CLI_COMMANDS.getBandOracleProviderOwner) {
    const owner = await bandOracleProvider.owner();
    console.log(`${title}:`, owner);
  } else if (action === ADMIN_ORACLE_CLI_COMMANDS.setBandOracleProviderOwner) {
    const config = getConfigInstant(environment.chainId, environment.env);
    if (!config) throw Error('config not found');
    const isGnosisSafe = config.isGnosisSafe;
    const owner = await bandOracleProvider.owner();

    const { newAddress } = await prompts(
      {
        type: 'text',
        name: 'newAddress',
        message: `New ${title} Address: (previous: ${owner.toString()})`,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    if (ethers.utils.isAddress(newAddress)) {
      if (isGnosisSafe) {
        const functionData = bandOracleProvider.interface.encodeFunctionData('transferOwnership', [
          newAddress,
        ]);

        await sendGnosisSafeTransaction(environment, bandOracleProvider.address, functionData);
      } else {
        await (
          await bandOracleProvider.transferOwnership(newAddress, {
            gasLimit: config.gasLimit,
            gasPrice: config.gasPrice,
          })
        ).wait();
      }
    } else {
      console.log('Eth address not valid');
    }
  }
};
