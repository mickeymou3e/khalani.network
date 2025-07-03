import { ERC20__factory } from '@balancer-labs/typechain';
import { Signer } from 'ethers';
import chalk from 'chalk';

export const balanceOf = async (tokenAddress: string, accountAddress: string, deployer: Signer) => {
  const erc20Contract = ERC20__factory.connect(tokenAddress, deployer);
  const balance = await erc20Contract.balanceOf(accountAddress);

  const symbol = await erc20Contract.symbol();
  const decimals = await erc20Contract.decimals();

  console.log(
    chalk.bgYellow(chalk.black(`${symbol}(dec ${decimals})`)),
    chalk.green('balance'),
    chalk.yellow(balance.toString())
  );

  return balance;
};
