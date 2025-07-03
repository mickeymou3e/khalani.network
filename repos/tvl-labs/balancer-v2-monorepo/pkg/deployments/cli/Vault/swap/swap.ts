import { BasePool__factory, ERC20__factory, Vault__factory } from '@balancer-labs/typechain';
import chalk from 'chalk';
import { BigNumber, constants, Signer } from 'ethers';

export async function swap(
  vaultAddress: string,
  poolAddress: string,
  amountIn: string,
  tokenIn: string,
  tokenOut: string,
  deployer: Signer
) {
  const deployerAddress = await deployer.getAddress();

  const poolContract = BasePool__factory.connect(poolAddress, deployer);
  const vaultContract = Vault__factory.connect(vaultAddress, deployer);

  const poolId = await poolContract.getPoolId();

  const tokenInContract = ERC20__factory.connect(tokenIn, deployer);
  const tokenOutContract = ERC20__factory.connect(tokenOut, deployer);

  const decimals = await tokenInContract.decimals();

  const balanceInPre = await tokenInContract.balanceOf(deployerAddress);
  const balanceOutPre = await tokenOutContract.balanceOf(deployerAddress);

  console.log(chalk.bgYellow(chalk.black('balance token in')), chalk.yellow(balanceInPre.toString()));
  console.log(chalk.bgYellow(chalk.black('balance token out')), chalk.yellow(balanceOutPre.toString()));

  const amountBN = BigNumber.from(amountIn);
  const allowance = await tokenInContract.allowance(deployerAddress, vaultAddress);

  console.log(chalk.bgYellow(chalk.black('allowance')), chalk.yellow(allowance.toString()));

  if (allowance.lt(amountBN)) {
    const approveTransaction = await tokenInContract.approve(vaultAddress, amountBN);
    await approveTransaction.wait(2);
  }

  try {
    await vaultContract.callStatic.swap(
      {
        poolId,
        kind: 0,
        amount: amountBN,
        assetIn: tokenIn,
        assetOut: tokenOut,
        userData: '0x',
      },
      {
        sender: deployerAddress,
        recipient: deployerAddress,
        fromInternalBalance: false,
        toInternalBalance: false,
      },
      0,
      constants.MaxUint256
    );
  } catch (error) {
    console.error(error);
  }

  const swapTransaction = await vaultContract.swap(
    {
      poolId,
      kind: 0,
      amount: amountBN,
      assetIn: tokenIn,
      assetOut: tokenOut,
      userData: '0x',
    },
    {
      sender: deployerAddress,
      recipient: deployerAddress,
      fromInternalBalance: false,
      toInternalBalance: false,
    },
    0,
    constants.MaxUint256
  );
  await swapTransaction.wait(2);

  const balanceInPost = await tokenInContract.balanceOf(deployerAddress);
  const balanceOutPost = await tokenOutContract.balanceOf(deployerAddress);

  console.log(chalk.bgGreen(chalk.black('balance token in')), chalk.green(balanceInPost.toString()));
  console.log(chalk.bgGreen(chalk.black('balance token out')), chalk.green(balanceOutPost.toString()));
}
