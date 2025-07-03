import { BigNumber } from '@ethersproject/bignumber';
import { connectToContractsRuntime } from '@scripts/connect';
import { formatTokens, writeToContractsConfig } from '@scripts/filesManager';
import { ScriptRunEnvironment } from '@src/types';
import { IToken } from '@src/types/types';
import { LendingContracts, delay, getConfigInstant } from '@src/utils';
import { ethers } from 'hardhat';

export async function deployBaseTestTokens(environment: ScriptRunEnvironment) {
  console.log('Check tokens in config');

  const { env, chainId, delayInMs, address } = environment;

  const config = getConfigInstant(chainId, env);

  if (config) {
    const tokens = config.tokens ?? [];

    const chainTokens = tokens.filter((token) => token.address);

    const tokensToDeploy = tokens.filter((token) => !token.address);

    const deployedTokens = await deployTestTokens(environment, address, tokensToDeploy, delayInMs);

    const allTokens: IToken[] = [...deployedTokens, ...chainTokens];

    const formattedTokens = formatTokens(allTokens);

    writeToContractsConfig(
      { tokens: formattedTokens },
      environment.chainId,
      environment.env,
      environment.networkName
    );
  }
}

export async function deployBaseSingleToken(
  environment: ScriptRunEnvironment,
  mintAddress: string,
  name: string,
  symbol: string,
  initialAmount: BigNumber,
  decimals: number
) {
  const { deployer, chainId, env } = environment;
  const config = getConfigInstant(chainId, env);
  if (!config) throw Error('config not found');
  const tokenFactory = await ethers.getContractFactory(LendingContracts.ERC20Mint, deployer);

  const deployerRequest = tokenFactory.getDeployTransaction(name, symbol, decimals, {
    gasPrice: config.gasPrice,
    gasLimit: config.gasLimit,
  });

  const tokenGasLimit = await deployer.estimateGas(deployerRequest);
  deployerRequest.gasLimit = tokenGasLimit;

  const receipt = await (await deployer.sendTransaction(deployerRequest)).wait();
  const contractAddress = receipt.contractAddress;

  const ercSelector = connectToContractsRuntime(environment).mintToken;
  const erc20Contract = ercSelector(contractAddress);

  const mintGasLimit = await erc20Contract.estimateGas.mint(mintAddress, initialAmount);

  await (
    await erc20Contract.mint(mintAddress, initialAmount, {
      gasPrice: config.gasPrice,
      gasLimit: mintGasLimit,
    })
  ).wait();

  console.log(
    'Token deployed',
    `(${contractAddress})`,
    symbol,
    BigNumber.from(await erc20Contract.balanceOf(mintAddress)).toString()
  );

  return { symbol: symbol, address: contractAddress, displaySymbol: symbol };
}

async function deployTestTokens(
  environment: ScriptRunEnvironment,
  mintAddress: string,
  tokens: IToken[],
  delayInMs: number
): Promise<IToken[]> {
  const deployedTokens: IToken[] = [];

  console.log('Deploying Test Tokens starting');
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i];
    const deploy = await deployBaseSingleToken(
      environment,
      mintAddress,
      token.name || '',
      token.symbol,
      BigNumber.from(token.initialValue || '100000000000000000000000000'),
      token.decimals || 18
    );

    await delay(delayInMs);
    deployedTokens.push(deploy);
  }

  console.log('Deploying Test Tokens completed');
  return deployedTokens;
}
