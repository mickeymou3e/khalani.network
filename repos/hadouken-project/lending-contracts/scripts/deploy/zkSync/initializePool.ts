import { BigNumberish } from 'ethers';

import { getMarketConfig } from '@markets/index';

import { connectToContractsRuntime } from '@scripts/connect';
import { ConfigureReservesByHelperProps, InitializeReservesByHelperProps } from '@scripts/types';
import {
  DefaultReserveInterestRateStrategy__factory,
  LendingPoolAddressesProvider,
} from '@src/typechain/zksync';
import {
  IReserveParams,
  ZkSyncDeploymentEnvironment,
  iMultiPoolsAssets,
  tEthereumAddress,
} from '@src/types';
import { chunk, delay, getConfigInstant, getContractsConfigInstant, waitForTx } from '@src/utils';
import { ContractFactory } from 'zksync-web3';

export const deployZkSyncRateStrategy = async (
  environments: ZkSyncDeploymentEnvironment,
  args: [tEthereumAddress, string, string, string, string, string, string]
): Promise<tEthereumAddress> => {
  console.log('Deploying rate strategy', { args });
  const { walletWithProvider } = environments;

  const rateStrategyFactory = new ContractFactory(
    DefaultReserveInterestRateStrategy__factory.abi,
    DefaultReserveInterestRateStrategy__factory.bytecode,
    walletWithProvider
  );

  const contract = await rateStrategyFactory.deploy(...args);

  console.log(`Rate strategy deployed: ${contract.address}`);

  return contract.address;
};

export const deployZkSyncReservesStrategies = async (
  reservesParams: iMultiPoolsAssets<IReserveParams>,
  tokenAddresses: { [symbol: string]: tEthereumAddress },
  addressProvider: LendingPoolAddressesProvider,
  environment: ZkSyncDeploymentEnvironment,
  delayInMs: number
) => {
  let strategyRates: [
    string, // addresses provider
    string,
    string,
    string,
    string,
    string,
    string
  ];
  let rateStrategies: Record<string, typeof strategyRates> = {};
  let strategyAddresses: Record<string, tEthereumAddress> = {};

  const reserves = Object.entries(reservesParams);

  console.log('starting to deploy reserves strategies');

  for (let [symbol, params] of reserves) {
    if (!tokenAddresses[symbol]) {
      console.log(`- Skipping init of ${symbol} due token address is not set at markets config`);
      continue;
    }

    const { strategy } = params;
    const {
      optimalUtilizationRate,
      baseVariableBorrowRate,
      variableRateSlope1,
      variableRateSlope2,
      stableRateSlope1,
      stableRateSlope2,
    } = strategy;

    if (!strategyAddresses[strategy.name]) {
      // Strategy does not exist, create a new one
      rateStrategies[strategy.name] = [
        addressProvider.address,
        optimalUtilizationRate,
        baseVariableBorrowRate,
        variableRateSlope1,
        variableRateSlope2,
        stableRateSlope1,
        stableRateSlope2,
      ];

      strategyAddresses[strategy.name] = await deployZkSyncRateStrategy(
        environment,
        rateStrategies[strategy.name]
      );
      await delay(delayInMs);
    }
  }
  return strategyAddresses;
};

export const initializeZkSyncReservesByHelper = async (
  environment: ZkSyncDeploymentEnvironment,
  {
    addressProvider,
    reservesParams,
    tokenAddresses,
    aTokenNamePrefix,
    stableDebtTokenNamePrefix,
    variableDebtTokenNamePrefix,
    treasuryAddress,
    incentivesController,
    aTokenAddress,
    stableTokenAddress,
    variableTokenAddress,
  }: InitializeReservesByHelperProps,
  delayInMs: number
) => {
  console.log('Initialization of initReservesByHelper');
  // CHUNK CONFIGURATION
  const initChunks = 1;

  // Initialize variables for future reserves initialization
  let reserveSymbols: string[] = [];

  let initInputParams: {
    aTokenImpl: string;
    stableDebtTokenImpl: string;
    variableDebtTokenImpl: string;
    underlyingAssetDecimals: BigNumberish;
    interestRateStrategyAddress: string;
    underlyingAsset: string;
    treasury: string;
    incentivesController: string;
    underlyingAssetName: string;
    aTokenName: string;
    aTokenSymbol: string;
    variableDebtTokenName: string;
    variableDebtTokenSymbol: string;
    stableDebtTokenName: string;
    stableDebtTokenSymbol: string;
    params: string;
  }[] = [];

  const reserves = Object.entries(reservesParams);

  console.log('Starting to deploy strategies');

  const strategyAddresses: Record<string, tEthereumAddress> = await deployZkSyncReservesStrategies(
    reservesParams,
    tokenAddresses,
    addressProvider as LendingPoolAddressesProvider,
    environment,
    delayInMs
  );

  for (let [symbol, params] of reserves) {
    if (!tokenAddresses[symbol]) {
      console.log(`- Skipping init of ${symbol} due token address is not set at markets config`);
      continue;
    }

    const symbolWithoutChainDirection = symbol.split('.')[0];

    const { strategy, reserveDecimals } = params;

    // Prepare input parameters
    reserveSymbols.push(symbol);

    initInputParams.push({
      aTokenImpl: aTokenAddress,
      stableDebtTokenImpl: stableTokenAddress,
      variableDebtTokenImpl: variableTokenAddress,
      underlyingAssetDecimals: reserveDecimals,
      interestRateStrategyAddress: strategyAddresses[strategy.name],
      underlyingAsset: tokenAddresses[symbol],
      treasury: treasuryAddress,
      incentivesController: incentivesController,
      underlyingAssetName: symbol,
      aTokenName: `${aTokenNamePrefix} ${symbolWithoutChainDirection}`,
      aTokenSymbol: `h${symbol}`,
      variableDebtTokenName: `${variableDebtTokenNamePrefix} ${symbolWithoutChainDirection}`,
      variableDebtTokenSymbol: `hv${symbolWithoutChainDirection}`,
      stableDebtTokenName: `${stableDebtTokenNamePrefix} ${symbolWithoutChainDirection}`,
      stableDebtTokenSymbol: `hs${symbolWithoutChainDirection}`,
      params: '0x10', // was hardcoded in Aave as well but inside a method
    });
  }

  // Deploy init reserves per chunks
  const chunkedSymbols = chunk(reserveSymbols, initChunks);
  const chunkedInitInputParams = chunk(initInputParams, initChunks);

  const configurator = connectToContractsRuntime(environment).poolConfiguration;

  if (!configurator) throw Error('configurator not found');

  console.log('batchInitReserve Starting');

  await delay(delayInMs);

  for (let chunkIndex = 0; chunkIndex < chunkedInitInputParams.length; chunkIndex++) {
    const receipt = await waitForTx(
      await configurator.batchInitReserve(chunkedInitInputParams[chunkIndex])
    );
    console.log(`  - Reserve ready for: ${chunkedSymbols[chunkIndex].join(', ')}`);
    console.log('    * gasUsed', receipt.gasUsed.toString());
    await delay(delayInMs);
  }
  console.log('batchInitReserve Completed');

  console.log('Initialization of initReservesByHelper Completed');
  return strategyAddresses;
};

export const configureZkSyncReservesByHelper = async (
  environment: ZkSyncDeploymentEnvironment,
  { reservesParams, tokenAddresses, helpers, admin }: ConfigureReservesByHelperProps,
  delayInMs: number
) => {
  console.log('Starting to configureReservesByHelper');

  const config = getConfigInstant(environment.chainId, environment.env, true);

  const configurator = connectToContractsRuntime(environment).poolConfiguration;

  if (!configurator) throw Error('configurator not found');

  const addressProvider = connectToContractsRuntime(environment).addressProvider;
  const aTokenAndRatesDeployer = connectToContractsRuntime(environment).aTokenAndRateHelper;

  if (!addressProvider) throw Error('address provider not found');
  if (!aTokenAndRatesDeployer) throw Error('aTokenAndRatesDeployer not found');

  const tokens: string[] = [];
  const symbols: string[] = [];

  const inputParams: {
    asset: string;
    baseLTV: BigNumberish;
    liquidationThreshold: BigNumberish;
    liquidationBonus: BigNumberish;
    reserveFactor: BigNumberish;
    stableBorrowingEnabled: boolean;
    borrowingEnabled: boolean;
  }[] = [];

  for (const [
    assetSymbol,
    {
      baseLTVAsCollateral,
      liquidationBonus,
      liquidationThreshold,
      reserveFactor,
      stableBorrowRateEnabled,
      borrowingEnabled,
    },
  ] of Object.entries(reservesParams) as [string, IReserveParams][]) {
    if (!tokenAddresses[assetSymbol]) {
      console.log(
        `- Skipping init of ${assetSymbol} due token address is not set at markets config`
      );

      continue;
    }
    if (baseLTVAsCollateral === '-1') continue;

    const assetAddressIndex = Object.keys(tokenAddresses).findIndex(
      (value) => value === assetSymbol
    );
    const [, tokenAddress] = (Object.entries(tokenAddresses) as [string, string][])[
      assetAddressIndex
    ];
    const { usageAsCollateralEnabled: alreadyEnabled } = await helpers.getReserveConfigurationData(
      tokenAddress
    );

    if (alreadyEnabled) {
      console.log(`- Reserve ${assetSymbol} is already enabled as collateral, skipping`);
      continue;
    }

    // Push data
    inputParams.push({
      asset: tokenAddress,
      baseLTV: baseLTVAsCollateral,
      liquidationThreshold: liquidationThreshold,
      liquidationBonus: liquidationBonus,
      reserveFactor: reserveFactor,
      stableBorrowingEnabled: stableBorrowRateEnabled,
      borrowingEnabled: borrowingEnabled,
    });

    tokens.push(tokenAddress);
    symbols.push(assetSymbol);
  }

  if (tokens.length) {
    console.log('Changing pool admin for configuration purpose');

    const setPoolAdminGasLimit = addressProvider.estimateGas.setPoolAdmin(
      aTokenAndRatesDeployer.address,
      {
        gasPrice: config?.gasPrice,
        gasLimit: config?.gasLimit,
      }
    );

    await waitForTx(
      await addressProvider.setPoolAdmin(aTokenAndRatesDeployer.address, {
        gasPrice: config?.gasPrice,
        gasLimit: setPoolAdminGasLimit,
      })
    );

    // Deploy init per chunks
    const enableChunks = 2;
    const chunkedSymbols = chunk(symbols, enableChunks);
    const chunkedInputParams = chunk(inputParams, enableChunks);

    console.log(`- Configure reserves in ${chunkedInputParams.length} txs`);

    for (let chunkIndex = 0; chunkIndex < chunkedInputParams.length; chunkIndex++) {
      await waitForTx(
        await aTokenAndRatesDeployer.configureReserves(chunkedInputParams[chunkIndex], {
          gasLimit: config?.gasLimit ? config?.gasLimit * 2 : undefined,
          gasPrice: config?.gasPrice,
        })
      );
      console.log(`  - Init for: ${chunkedSymbols[chunkIndex].join(', ')}`);
      await delay(delayInMs);
    }
    // Set deployer back as admin
    console.log('Changing pool admin back');
    await waitForTx(
      await addressProvider.setPoolAdmin(admin, {
        gasLimit: setPoolAdminGasLimit,
        gasPrice: config?.gasPrice,
      })
    );
  }

  for (const [symbol, { borrowCap, supplyCap }] of Object.entries(reservesParams) as [
    string,
    IReserveParams
  ][]) {
    if (supplyCap) {
      console.log(`set deposit cap for ${symbol}:`, supplyCap.toString());
      await waitForTx(await configurator.setDepositCap(tokenAddresses[symbol], supplyCap));
      console.log(`set deposit cap for ${symbol} completed`);
      await delay(delayInMs);
    }
    if (borrowCap) {
      console.log(`set borrow cap for ${symbol}:`, borrowCap.toString());
      await waitForTx(await configurator.setBorrowCap(tokenAddresses[symbol], borrowCap));
      await delay(delayInMs);
      console.log(`set borrow cap for ${symbol} completed`);
    }
  }

  console.log('ConfigureReservesByHelper Completed');
};

export async function deployZkSyncInitialization(environment: ZkSyncDeploymentEnvironment) {
  const { chainId, env, delayInMs } = environment;

  const marketConfig = getMarketConfig(environment);
  const {
    ATokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    ReserveAssets,
    ReservesConfig,
    IncentivesController,
  } = marketConfig;

  const contractsConfig = getContractsConfigInstant(chainId, env, true);

  if (!contractsConfig) throw Error('contractsConfig not found');

  const addressProvider = connectToContractsRuntime(environment).addressProvider;
  const dataProvider = connectToContractsRuntime(environment).dataProvider;

  if (!addressProvider) throw Error('addressProvider not found');
  if (!dataProvider) throw Error('dataProvider not found');

  const admin = await addressProvider.getPoolAdmin();

  if (!ReserveAssets) {
    throw 'Reserve assets is undefined. Check ReserveAssets configuration at config directory';
  }

  const strategies = await initializeZkSyncReservesByHelper(
    environment,
    {
      addressProvider: addressProvider,
      aTokenNamePrefix: ATokenNamePrefix,
      incentivesController: IncentivesController,
      poolConfigAddress: contractsConfig.poolConfiguratorProxy,
      variableDebtTokenNamePrefix: VariableDebtTokenNamePrefix,
      stableDebtTokenNamePrefix: StableDebtTokenNamePrefix,
      tokenAddresses: ReserveAssets,
      reservesParams: ReservesConfig,
      treasuryAddress: contractsConfig.treasury,
      aTokenAddress: contractsConfig.aToken,
      stableTokenAddress: contractsConfig.stableDebtToken,
      variableTokenAddress: contractsConfig.variableDebtToken,
    },
    delayInMs
  );
  await delay(delayInMs);

  await configureZkSyncReservesByHelper(
    environment,
    {
      reservesParams: ReservesConfig,
      tokenAddresses: ReserveAssets,
      helpers: dataProvider,
      admin,
    },
    delayInMs
  );
  await delay(delayInMs);

  return {
    strategies,
  };
}

export async function initializeZkSyncPool(environment: ZkSyncDeploymentEnvironment) {
  const { env, chainId } = environment;
  const contractsConfig = getContractsConfigInstant(chainId, env);
  const config = getConfigInstant(chainId, env);
  const delayTime = Number(config?.delay);
  const addressProviderAddress = contractsConfig?.addressProvider;

  if (!addressProviderAddress) {
    console.log('Address provider has not been initialized! Aborting deployment of data provider.');
    return;
  }

  const { strategies } = await deployZkSyncInitialization(environment);

  console.log('deployed strategies', strategies);

  await delay(delayTime);
}
