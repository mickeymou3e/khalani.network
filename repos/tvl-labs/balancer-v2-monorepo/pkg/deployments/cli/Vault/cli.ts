import prompts from 'prompts';
import { ethers, network } from 'hardhat';
import { Cli } from '../types';

import joinCli from './join/cli';
import swapCli from './swap/cli';

import input from './input';
import createGetterMethodsCli from '../utils/createGetterMethodsCli';
import vaultAbi from './abi/Vault.json';
import protocolFeesCollectorCli from './ProtocolFeesCollector/cli';
import { Vault__factory } from '@balancer-labs/typechain';
import chalk from 'chalk';

const vaultCli: Cli = async (cliProps) => {
  const { Vault: vaultAddress } = input.VaultTask.output({ network: network.name });
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
      console.log(chalk.bgYellow(chalk.black('balances')), chalk.yellow(balances.map((balance) => balance.toString())));

      break;
    }
  }
};

export default vaultCli;
