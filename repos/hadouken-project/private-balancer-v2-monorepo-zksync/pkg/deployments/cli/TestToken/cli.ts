import prompts from 'prompts';

import { Cli } from '../types';

import chalk from 'chalk';
import { ethers } from 'hardhat';
import ERC20MockJSON from '../../../solidity-utils/artifacts-zk/contracts/openzeppelin/ERC20_test.sol/ERC20_test.json';
import deployCli from './deploy/cli';
import mintCli from './mint/cli';

const testTokenCli: Cli = async (cliProps) => {
  const { action } = await prompts(
    {
      type: 'select',
      name: 'action',
      message: 'Select action',
      choices: [
        { title: 'deploy', value: 'deploy' },
        { title: 'mint', value: 'mint' },
        { title: 'balanceOf', value: 'balanceOf' },
      ],
    },
    {
      onCancel: () => {
        return cliProps.parentCli ? cliProps.parentCli(cliProps) : process.exit(0);
      },
    }
  );

  switch (action) {
    case 'deploy': {
      await deployCli({ ...cliProps, parentCli: testTokenCli });
      break;
    }
    case 'mint': {
      await mintCli({ ...cliProps, parentCli: testTokenCli });
      break;
    }
    case 'balanceOf': {
      const deployer = (await ethers.getSigners())[0];
      const { address } = await prompts({
        type: 'text',
        name: 'address',
        message: 'address',
      });
      const { account } = await prompts({
        type: 'text',
        name: 'account',
        message: 'account',
        initial: deployer.address,
      });

      const erc20Mock = new ethers.Contract(address, ERC20MockJSON.abi, deployer);
      const balance = await erc20Mock.balanceOf(account);

      console.log(chalk.bgYellow(chalk.black('balance')), chalk.yellow(balance.toString()));
    }
  }

  return testTokenCli(cliProps);
};

export default testTokenCli;
