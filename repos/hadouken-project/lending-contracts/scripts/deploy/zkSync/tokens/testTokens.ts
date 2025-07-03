import { connectToContractsRuntime } from '@scripts/connect';
import { formatTokens, writeToContractsConfig } from '@scripts/filesManager';
import { ZkSyncDeploymentEnvironment } from '@src/types';
import { IToken } from '@src/types/types';
import { LendingContracts, getConfigInstant, waitForTx } from '@src/utils';
import { BigNumber } from 'ethers';

export async function deployZkSyncTestTokens(environment: ZkSyncDeploymentEnvironment) {
  console.log('Check tokens in config');

  const { env, chainId, walletWithProvider } = environment;

  const config = getConfigInstant(chainId, env);

  if (config) {
    const tokens = config.tokens ?? [];

    const chainTokens = tokens.filter((token) => token.address);

    const tokensToDeploy = tokens.filter((token) => !token.address);

    const deployedTokens = await deployTestTokens(
      environment,
      walletWithProvider.address,
      tokensToDeploy
    );

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

export async function deployZkSyncSingleTestToken(
  environment: ZkSyncDeploymentEnvironment,
  mintAddress: string,
  name: string,
  symbol: string,
  initialAmount: BigNumber,
  decimals: number
) {
  const { deployer } = environment;
  const tokenFactory = await deployer.loadArtifact(LendingContracts.ERC20Mint);

  const token = await deployer.deploy(tokenFactory, [name, symbol, decimals]);

  const contractAddress = token.address;

  const erc20Contract = connectToContractsRuntime(environment).mintToken(contractAddress);

  await waitForTx(await erc20Contract.mint(mintAddress, initialAmount));

  console.log(
    'Token deployed',
    `(${contractAddress})`,
    symbol,
    BigNumber.from(await erc20Contract.balanceOf(mintAddress)).toString()
  );

  return { symbol: symbol, address: contractAddress, displaySymbol: symbol };
}

async function deployTestTokens(
  environment: ZkSyncDeploymentEnvironment,
  mintAddress: string,
  tokens: IToken[]
): Promise<IToken[]> {
  const deployedTokens: IToken[] = [];

  if (tokens.length === 0) {
    console.log('No tokens to deploy (already deployed)');
    return deployedTokens;
  }

  console.log('Deploying Test Tokens starting');

  for (const token of tokens) {
    const deploy = await deployZkSyncSingleTestToken(
      environment,
      mintAddress,
      token.name || '',
      token.symbol,
      BigNumber.from(token.initialValue || '100000000000000000000000000'),
      token.decimals || 18
    );

    deployedTokens.push(deploy);
  }

  console.log('Deploying Test Tokens completed');
  return deployedTokens;
}
