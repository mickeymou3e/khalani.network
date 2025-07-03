import prompts from 'prompts';

import { Cli } from '@src/types';

import { TREASURY_CLI_COMMANDS } from '@cli/types';
import { connectToContractsRuntime } from '@scripts/connect';
import { HadoukenCollectorV2 } from '@src/typechain/godwoken';

export const AdministrationForTreasuryCli: Cli = async ({ environment, parentCli }) => {
  const treasury = connectToContractsRuntime(environment).treasury;
  if (!treasury) throw Error('treasury not found');

  const hadoukenCollector: HadoukenCollectorV2 = connectToContractsRuntime(environment)
    .hadoukenCollector as HadoukenCollectorV2;
  if (!hadoukenCollector) throw Error('hadoukenCollector not found');

  const title = 'Treasury Admin';

  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select method',
      choices: [
        {
          title: TREASURY_CLI_COMMANDS.getOwner.toString(),
          value: TREASURY_CLI_COMMANDS.getOwner,
        },
        {
          title: `${TREASURY_CLI_COMMANDS.setOwner.toString()} (Gnosis support)`,
          value: TREASURY_CLI_COMMANDS.setOwner,
        },

        // {
        //   title: `Redeploy Hadouken Collector`,
        //   value: PoolActions.HadoukenCollectorRedeploy,
        // },
        // {
        //   title: `Hadouken Collector Upgrade (Gnosis support)`,
        //   value: PoolActions.HadoukenCollectorUpgrade,
        // },
        // {
        //   title: `Transfer money from treasury`,
        //   value: PoolActions.HadoukenCollectorTransfer,
        // },
        // {
        //   title: `HadoukenCollectorOwner`,
        //   value: PoolActions.HadoukenCollectorOwner,
        // },
        // {
        //   title: `HadoukenCollectorTransferOwnership`,
        //   value: PoolActions.HadoukenCollectorTransferOwnership,
        // },
      ],
    },
    {
      onCancel: () => {
        return parentCli ? parentCli({ environment }) : process.exit(0);
      },
    }
  );

  if (action === TREASURY_CLI_COMMANDS.getOwner) {
    try {
      const owner = await treasury.callStatic.admin();

      console.log(`${title}:`, owner);
    } catch (e) {
      console.log('you are not an admin');
    }
  } else if (action === TREASURY_CLI_COMMANDS.setOwner) {
    const previousOwner = await hadoukenCollector.owner();

    const { newOwner } = await prompts(
      {
        type: 'text',
        name: 'newOwner',
        message: `Set new owner of collector: (previous: ${previousOwner.toString()})`,
      },
      {
        onCancel: () => {
          return parentCli ? parentCli({ environment }) : process.exit(0);
        },
      }
    );

    const receipt = await hadoukenCollector.transferOwnership(newOwner);
    await receipt.wait();
    console.log('transfer ownership to', newOwner);
    return;
  }
  //   } else if (action === PoolActions.HadoukenCollectorRedeploy) {
  //     const hadoukenCollectorFactory = await ethers.getContractFactory(
  //       LendingContracts.HadoukenCollectorV2,
  //       environment.deployer
  //     );

  //     const result = await hadoukenCollectorFactory.deploy();

  //     const address = result.address;

  //     console.log('address', address);

  //     writeToContractsConfig(
  //       {
  //         hadoukenCollector: address,
  //       },
  //       environment.chainId,
  //       environment.env,
  //       environment.networkName
  //     );
  //     return;
  //   }
  //   } else if (action === PoolActions.HadoukenCollectorUpgrade) {
  //     const config = getConfigInstant(environment.chainId, environment.env);
  //     const contractsConfig = getContractsConfigInstant(environment.chainId, environment.env, true);

  //     const collector = HadoukenCollectorV2__factory.connect(
  //       contractsConfig.hadoukenCollector,
  //       environment.deployer
  //     );

  //     const treasury = BaseAdminUpgradeabilityProxy__factory.connect(
  //       contractsConfig.treasury,
  //       environment.deployer
  //     );

  //     const { newOwner } = await prompts(
  //       {
  //         type: 'text',
  //         name: 'newOwner',
  //         message: `Set owner for collector`,
  //       },
  //       {
  //         onCancel: () => {
  //           return parentCli ? parentCli({ environment }) : process.exit(0);
  //         },
  //       }
  //     );

  //     // This is needed to pass new owner
  //     const initializeCollectorData = collector.interface.encodeFunctionData('initialize', [
  //       newOwner,
  //     ]);

  //     const isGnosisSafe = config.isGnosisSafe;

  //     if (isGnosisSafe) {
  //       const functionData = treasury.interface.encodeFunctionData('upgradeToAndCall', [
  //         contractsConfig.hadoukenCollector,
  //         initializeCollectorData,
  //       ]);
  //       await sendGnosisSafeTransaction(environment, treasury.address, functionData);
  //       console.log('Update implementation of Collector request to gnosis safe');
  //     } else {
  //       const transaction = await treasury.upgradeToAndCall(
  //         contractsConfig.hadoukenCollector,
  //         initializeCollectorData
  //       );

  //       const receipt = await transaction.wait();

  //       console.log('receipt', receipt);
  //     }

  //     return;
  //   } else if (action === PoolActions.HadoukenCollectorTransfer) {
  //     const config = getContractsConfigInstant(environment.chainId, environment.env);

  //     if (!config.tokens) {
  //       console.error('No tokens in config file!');
  //       return;
  //     }

  //     const tokens = Object.keys(config.tokens);
  //     const { address } = await prompts(
  //       {
  //         type: 'select',
  //         name: 'address',
  //         message: 'Select A Token',
  //         choices: tokens.map((symbol) => ({
  //           value: config.tokens[symbol].aTokenAddress,
  //           title: `(${symbol})`,
  //         })),
  //       },
  //       {
  //         onCancel: () => {
  //           return parentCli ? parentCli({ environment }) : process.exit(0);
  //         },
  //       }
  //     );

  //     const erc20 = ERC20__factory.connect(address, environment.deployer);
  //     const tokenDecimals = await erc20.decimals();

  //     const { userAddress } = await prompts(
  //       {
  //         type: 'text',
  //         name: 'userAddress',
  //         message: `User address:`,
  //       },
  //       {
  //         onCancel: () => {
  //           return parentCli ? parentCli({ environment }) : process.exit(0);
  //         },
  //       }
  //     );

  //     const { amount } = await prompts(
  //       {
  //         type: 'text',
  //         name: 'amount',
  //         message: `Amount (float number):`,
  //       },
  //       {
  //         onCancel: () => {
  //           return parentCli ? parentCli({ environment }) : process.exit(0);
  //         },
  //       }
  //     );

  //     console.log('amount as bigNumber', FloatToBigNumber(amount, tokenDecimals).toString());

  //     const collector = HadoukenCollectorV2__factory.connect(config.treasury, environment.deployer);

  //     const transaction = await collector.transfer(
  //       address,
  //       userAddress,
  //       FloatToBigNumber(amount, tokenDecimals)
  //     );

  //     const receipt = await transaction.wait();

  //     console.log('receipt', receipt);

  //     return;
  //   } else if (action === PoolActions.setOwner) {
  //     const config = getConfigInstant(environment.chainId, environment.env);
  //     const isGnosisSafe = config.isGnosisSafe;
  //     let owner = 'Unknown';
  //     try {
  //       owner = await contract.callStatic.admin();
  //     } catch (e) {
  //       console.log('you are not the owner');
  //     }

  //     const { newAddress } = await prompts(
  //       {
  //         type: 'text',
  //         name: 'newAddress',
  //         message: `New ${title} Address: (previous: ${owner.toString()})`,
  //       },
  //       {
  //         onCancel: () => {
  //           return parentCli ? parentCli({ environment }) : process.exit(0);
  //         },
  //       }
  //     );

  //     if (ethers.utils.isAddress(newAddress)) {
  //       if (isGnosisSafe) {
  //         const functionData = contract.interface.encodeFunctionData('changeAdmin', [newAddress]);

  //         await sendGnosisSafeTransaction(environment, contract.address, functionData);
  //       } else {
  //         await (
  //           await contract.changeAdmin(newAddress, {
  //             gasLimit: config.gasLimit,
  //             gasPrice: config.gasPrice,
  //           })
  //         ).wait();
  //       }
  //     } else {
  //       console.log('Eth address not valid');
  //     }
  //   } else if (action === PoolActions.HadoukenCollectorOwner) {
  //     const config = getContractsConfigInstant(environment.chainId, environment.env);
  //     const collector = HadoukenCollectorV2__factory.connect(config.treasury, environment.deployer);

  //     const owner = await collector.owner();
  //     console.log('owner', owner);
  //     return;
  //   }
};
