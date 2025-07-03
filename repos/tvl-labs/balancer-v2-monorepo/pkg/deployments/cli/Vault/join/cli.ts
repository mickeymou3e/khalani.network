import { ethers } from 'hardhat';
import { ERC20__factory, BasePool__factory, Vault__factory } from '@balancer-labs/typechain';
import chalk from 'chalk';
import { BigNumber, BigNumberish, BytesLike } from 'ethers';
import prompts from 'prompts';

const MAX_BIG_NUMBER = BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

enum JoinKind {
  INIT,
  EXACT_TOKENS_IN_FOR_BPT_OUT,
  TOKEN_IN_FOR_EXACT_BPT_OUT,
}

async function initJoinData(amountsIn: BigNumberish[], maxAmountsIn: BigNumberish[], tokens: string[]) {
  const initUserData = ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'uint256[]'],
    [JoinKind.INIT, amountsIn.map((amount) => amount.toString())]
  );

  const joinPoolRequest: {
    assets: string[];
    maxAmountsIn: BigNumberish[];
    userData: BytesLike;
    fromInternalBalance: boolean;
  } = {
    assets: tokens,
    maxAmountsIn: maxAmountsIn,
    userData: initUserData,
    fromInternalBalance: false,
  };

  return joinPoolRequest;
}

async function exactInJoinData(amountsIn: BigNumberish[], maxAmountsIn: BigNumberish[], tokens: string[]) {
  const initUserData = ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'uint256[]', 'uint256'],
    [JoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT, amountsIn.map((amount) => amount.toString()), BigNumber.from(0).toString()]
  );

  const joinPoolRequest: {
    assets: string[];
    maxAmountsIn: BigNumberish[];
    userData: BytesLike;
    fromInternalBalance: boolean;
  } = {
    assets: tokens,
    maxAmountsIn: maxAmountsIn,
    userData: initUserData,
    fromInternalBalance: false,
  };

  return joinPoolRequest;
}

async function joinCli(vaultAddress: string, poolAddress: string) {
  const deployer = (await ethers.getSigners())[0];

  const poolContract = BasePool__factory.connect(poolAddress, deployer);
  const vaultContract = Vault__factory.connect(vaultAddress, deployer);

  const poolId = await poolContract.getPoolId();
  const { tokens } = await vaultContract.getPoolTokens(poolId);

  const liquidityTokens: string[] = [];
  const liquidityAmounts: BigNumber[] = [];

  const poolTokens = tokens.filter((token) => token.toLowerCase() !== poolAddress.toLowerCase());
  for (const token of poolTokens) {
    const { token } = await prompts({
      type: 'select',
      name: 'token',
      message: `token`,
      choices: poolTokens
        .sort()
        .filter((token) => !liquidityTokens.includes(token))
        .map((token) => ({ title: token, value: token })),
    });

    const tokenContract = ERC20__factory.connect(token, deployer);

    const decimals = await tokenContract.decimals();
    const balance = await tokenContract.balanceOf(deployer.address);

    console.log(chalk.bgYellow(chalk.black('balance')), chalk.yellow(balance.toString()));

    const { amount } = await prompts({
      type: 'text',
      name: 'amount',
      message: `amount (${decimals})`,
    });
    const amountBN = BigNumber.from(amount);

    const allowance = await tokenContract.allowance(deployer.address, vaultAddress);

    if (allowance.lt(amountBN)) {
      const approveTransaction = await tokenContract.approve(vaultAddress, amountBN);
      await approveTransaction.wait(2);
    }

    liquidityAmounts.push(amountBN);
    liquidityTokens.push(token);
  }

  const initializedTokensAmount: BigNumberish[] = [];
  const initializedTokensAmountMaxIn: BigNumberish[] = [];
  for (const token of tokens) {
    const initializedTokenIndex = liquidityTokens.indexOf(token);
    const amount = liquidityAmounts[initializedTokenIndex];
    if (initializedTokenIndex >= 0) {
      initializedTokensAmount.push(amount);
      initializedTokensAmountMaxIn.push(amount);
    } else {
      initializedTokensAmount.push(0);
      initializedTokensAmountMaxIn.push(MAX_BIG_NUMBER);
    }
  }

  const { joinKind } = await prompts({
    type: 'select',
    name: 'joinKind',
    message: `join kind`,
    choices: [
      { value: JoinKind.INIT.toString(), title: 'init' },
      { value: JoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT.toString(), title: 'exact in' },
    ],
  });

  let data;
  if (joinKind === JoinKind.INIT.toString()) {
    data = await initJoinData(initializedTokensAmount, initializedTokensAmountMaxIn, tokens);
  } else if (joinKind === JoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT.toString()) {
    data = await exactInJoinData(initializedTokensAmount, initializedTokensAmountMaxIn, tokens);
  } else {
    data = await initJoinData(initializedTokensAmount, initializedTokensAmountMaxIn, liquidityTokens);
  }

  console.log(
    chalk.bgYellow(chalk.black('liquidity')),
    chalk.yellow(liquidityAmounts.map((amount) => amount.toString()))
  );
  try {
    await vaultContract.callStatic.joinPool(poolId, deployer.address, deployer.address, data);
  } catch (error) {
    console.error(error);
  }

  const joinPoolTransaction = await vaultContract.joinPool(poolId, deployer.address, deployer.address, data);
  await joinPoolTransaction.wait(2);

  const balance = await poolContract.balanceOf(deployer.address);
  console.log(chalk.bgYellow(chalk.black('balance')), chalk.yellow(balance.toString()));
}

export default joinCli;
