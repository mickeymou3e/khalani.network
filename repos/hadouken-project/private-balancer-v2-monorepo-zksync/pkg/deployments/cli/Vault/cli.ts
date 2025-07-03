import { ethers, network } from 'hardhat';
import prompts from 'prompts';
import { Cli } from '../types';

import joinCli from './join/cli';
import swapCli from './swap/cli';

import { Vault__factory } from '@balancer-labs/typechain';
import chalk from 'chalk';
import createGetterMethodsCli from '../utils/createGetterMethodsCli';
import vaultAbi from './abi/Vault.json';
import protocolFeesCollectorCli from './ProtocolFeesCollector/cli';
import { getDeploymentsByRuntimeEnv } from '../../../config/src/deployments';

const vaultCli: Cli = async (cliProps) => {
  const { Vault: vaultAddress } = getDeploymentsByRuntimeEnv(cliProps.environment.network);

  const deployer = (await ethers.getSigners())[0];

  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [
      { title: 'initial join', value: 'initial join' },
      { title: 'swap', value: 'swap' },
      { title: 'getter methods', value: 'getters' },
      { title: 'getPoolTokens', value: 'getPoolTokens' },
      { title: 'ProtocolFeesCollector', value: 'ProtocolFeesCollector' },
      { title: 'GenerateRolesForBatchRelayer', value: 'GenerateRolesForBatchRelayer' },
      { title: 'Get action id', value: 'GetActionId' },
    ],
  });

  switch (action) {
    case 'initial join': {
      const { poolAddress } = await prompts({
        type: 'text',
        name: 'poolAddress',
        message: 'pool address',
      });
      await joinCli(vaultAddress, poolAddress);
      break;
    }
    case 'swap': {
      const { poolAddress } = await prompts({
        type: 'text',
        name: 'poolAddress',
        message: 'pool address',
      });
      await swapCli(vaultAddress, poolAddress);
      break;
    }
    case 'getters': {
      const getterMethodsCli = createGetterMethodsCli(vaultAbi);
      await getterMethodsCli(vaultAddress, cliProps);

      break;
    }
    case 'ProtocolFeesCollector': {
      const vaultContract = Vault__factory.connect(vaultAddress, deployer);
      const protocolFeesCollectorAddress = await vaultContract.getProtocolFeesCollector();
      await protocolFeesCollectorCli(protocolFeesCollectorAddress, cliProps);

      break;
    }
    case 'getPoolTokens': {
      const { poolId } = await prompts({
        type: 'text',
        name: 'poolId',
        message: 'pool id',
      });
      const vaultContract = Vault__factory.connect(vaultAddress, deployer);
      try {
        await vaultContract.callStatic.getPoolTokens(poolId);
      } catch (error) {
        console.error(error);
      }
      const { tokens, balances } = await vaultContract.getPoolTokens(poolId);

      console.log(chalk.bgYellow(chalk.black('tokens')), chalk.yellow(tokens));
      console.log(chalk.bgYellow(chalk.black('balancer')), chalk.yellow(balances.map((balance) => balance.toString())));

      break;
    }
    case 'GenerateRolesForBatchRelayer': {
      const roles = await Promise.all(
        ['manageUserBalance', 'joinPool', 'exitPool', 'swap', 'batchSwap', 'setRelayerApproval'].map(async (role) => {
          const vaultContract = Vault__factory.connect(vaultAddress, deployer);
          const data = await vaultContract.getActionId(vaultContract.interface.getSighash(role));
          return data;
        })
      );
      console.log('roles id', roles);
      break;
    }

    case 'GetActionId': {
      const { methodName } = await prompts({
        type: 'text',
        name: 'methodName',
        message: 'methodName',
      });

      const vaultContract = Vault__factory.connect(vaultAddress, deployer);
      const actionId = await vaultContract.getActionId(vaultContract.interface.getSighash(methodName));
      console.log('actionId', actionId);

      break;
    }
  }
};

export default vaultCli;
