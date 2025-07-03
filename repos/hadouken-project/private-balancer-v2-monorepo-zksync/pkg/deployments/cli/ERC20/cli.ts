import prompts from 'prompts';

import { WETH__factory } from '@balancer-labs/typechain';
import chalk from 'chalk';
import { ethers } from 'hardhat';
import { Cli } from '../types';
import createGetterMethodsCli from '../utils/createGetterMethodsCli';
import { createSetterMethodsCli } from '../utils/createSetterMethodsCli';
import abi from './abi/ERC20.json';
import { balanceOf } from './balanceOf';

const erc20Cli: Cli = async (cliProps) => {
  const { action } = await prompts({
    type: 'select',
    name: 'action',
    message: 'Select action',
    choices: [
      { title: 'getters', value: 'getters' },
      { title: 'setters', value: 'setters' },
      { title: 'wEth', value: 'wEth' },
      { title: 'balanceOf', value: 'balanceOf' },
    ],
  });

  const { address } = await prompts({
    type: 'text',
    name: 'address',
    message: 'address',
  });

  switch (action) {
    case 'getters': {
      const getterMethodsCli = createGetterMethodsCli(abi);
      await getterMethodsCli(address, cliProps);

      break;
    }
    case 'setters': {
      const setterMethodsCli = createSetterMethodsCli(abi);
      await setterMethodsCli(address, cliProps);

      break;
    }
    case 'wEth': {
      const wEth = WETH__factory.connect('0x20b28B1e4665FFf290650586ad76E977EAb90c5D', cliProps.environment.deployer);
      const { amount } = await prompts({
        type: 'number',
        name: 'amount',
        message: 'Amount',
      });
      const result = await wEth.deposit({ value: amount });
      await result.wait();

      break;
    }
    case 'balanceOf': {
      const deployer = (await ethers.getSigners())[0];
      const { account } = await prompts({
        type: 'text',
        name: 'account',
        message: 'account',
        initial: deployer.address,
      });

      const balance = await balanceOf(address, account, deployer);
      console.log(chalk.bgYellow(chalk.black('balance')), chalk.yellow(balance.toString()));
    }
  }
};

export default erc20Cli;
