import { BasePool__factory, ERC20__factory, Vault__factory } from '@balancer-labs/typechain';
import { ethers } from 'hardhat';
import prompts from 'prompts';
import { swap } from './swap';

async function swapCli(vaultAddress: string, poolAddress: string): Promise<void> {
  const deployer = (await ethers.getSigners())[0];

  const poolContract = BasePool__factory.connect(poolAddress, deployer);
  const vaultContract = Vault__factory.connect(vaultAddress, deployer);

  const poolId = await poolContract.getPoolId();
  const { tokens } = await vaultContract.getPoolTokens(poolId);

  const { tokenIn } = await prompts({
    type: 'select',
    name: 'tokenIn',
    message: `tokenIn`,
    choices: tokens.map((token) => ({ title: token, value: token })),
  });
  const { tokenOut } = await prompts({
    type: 'select',
    name: 'tokenOut',
    message: `tokenOut`,
    choices: tokens.map((token) => ({ title: token, value: token })),
  });

  const tokenInContract = ERC20__factory.connect(tokenIn, deployer);
  const decimals = await tokenInContract.decimals();

  const { amount } = await prompts({
    type: 'text',
    name: 'amount',
    message: `amount (decimals: ${decimals})`,
  });

  await swap(vaultAddress, poolAddress, amount, tokenIn, tokenOut, deployer);
}

export default swapCli;
