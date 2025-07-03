import { BasePool__factory, ERC20__factory, Vault__factory } from '@hadouken-project/typechain';
import chalk from 'chalk';
import { BigNumber, BigNumberish, BytesLike, ethers } from 'ethers';
import { ScriptRunEnvironment } from '../../types';

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

export async function initJoin(
  environment: ScriptRunEnvironment,
  vaultAddress: string,
  poolAddress: string,
  initialAmounts: { [key: string]: BigNumberish }
): Promise<void> {
  const initialAmountsParsed = Object.entries(initialAmounts).reduce<{ [key: string]: BigNumberish }>(
    (total, [key, value]) => {
      total[key.toLowerCase()] = value;

      return total;
    },
    {}
  );

  const deployer = environment.deployer;
  const deployerAddress = await deployer.getAddress();

  const poolContract = BasePool__factory.connect(poolAddress, deployer);
  const vaultContract = Vault__factory.connect(vaultAddress, deployer);

  const poolId = await poolContract.getPoolId();
  const { tokens } = await vaultContract.getPoolTokens(poolId);

  const liquidityTokens: string[] = [];
  const liquidityAmounts: BigNumber[] = [];

  const poolTokens = tokens.filter((token) => token.toLowerCase() !== poolAddress.toLowerCase());
  for (const poolToken of poolTokens) {
    const tokenContract = ERC20__factory.connect(poolToken, deployer);

    const initialAmount = initialAmountsParsed[poolToken.toLowerCase()];

    const amountBN = BigNumber.from(initialAmount);

    const allowance = await tokenContract.allowance(deployerAddress, vaultAddress);

    if (allowance.lt(amountBN)) {
      const approveTransaction = await tokenContract.approve(vaultAddress, amountBN);
      await approveTransaction.wait(2);
    }

    const balance = await tokenContract.balanceOf(deployerAddress);
    if (balance.lt(amountBN)) {
      throw new Error(`${deployerAddress} balance insufficient`);
    }

    liquidityAmounts.push(amountBN);
    liquidityTokens.push(poolToken);
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
      initializedTokensAmountMaxIn.push(ethers.constants.MaxUint256);
    }
  }

  const data = await initJoinData(initializedTokensAmount, initializedTokensAmountMaxIn, tokens);

  console.log(
    chalk.bgYellow(chalk.black('liquidity')),
    chalk.yellow(liquidityAmounts.map((amount) => amount.toString()))
  );

  try {
    await vaultContract.callStatic.joinPool(poolId, deployerAddress, deployerAddress, data);
  } catch (error) {
    console.error(error);
  }

  const joinPoolTransaction = await vaultContract.joinPool(poolId, deployerAddress, deployerAddress, data);
  await joinPoolTransaction.wait(2);

  const balance = await poolContract.balanceOf(deployerAddress);
  console.log(chalk.bgYellow(chalk.black('balance')), chalk.yellow(balance.toString()));
}
