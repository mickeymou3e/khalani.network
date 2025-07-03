import { oneEther, ZERO_ADDRESS } from '@src/constants';
import {
  IMarketConfig,
  IMarketRates,
  iMultiPoolsAssets,
  IReserveParams,
  ScriptRunEnvironment,
  ZkSyncDeploymentEnvironment,
} from '@src/types';
import { Tokens } from '@src/types/types';

import { getContractsConfigInstant } from '@src/utils';

import { strategies } from './reservesConfigs';

export const getMarketConfig = (
  runEnvironment: ScriptRunEnvironment | ZkSyncDeploymentEnvironment,
  forTokens?: string[]
): IMarketConfig => {
  const contractsConfig = getContractsConfigInstant(
    runEnvironment.chainId,
    runEnvironment.env,
    true
  );

  if (!contractsConfig) throw Error('contractsConfig is empty');
  const ReservesConfig: { [symbol: string]: IReserveParams } = {};
  const ReserveAssets: { [symbol: string]: string } = {};
  const LendingRateOracleRatesCommon: iMultiPoolsAssets<IMarketRates> = {};
  const tokens = contractsConfig.tokens!;

  const filteredTokens = forTokens
    ? (Object.fromEntries(
        Object.entries(tokens).filter(([symbol]) => forTokens?.includes(symbol))
      ) as Tokens)
    : tokens;

  const filteredStrategies = strategies.filter((strategy) => filteredTokens[strategy.symbol]);

  filteredStrategies.forEach((element) => {
    const {
      strategy,
      baseLTVAsCollateral,
      liquidationThreshold,
      liquidationBonus,
      borrowingEnabled,
      stableBorrowRateEnabled,
      reserveDecimals,
      aTokenImpl,
      reserveFactor,
      borrowCap,
      supplyCap,
    } = element;
    ReservesConfig[element.symbol] = {
      strategy,
      baseLTVAsCollateral,
      liquidationThreshold,
      liquidationBonus,
      borrowingEnabled,
      stableBorrowRateEnabled,
      reserveDecimals,
      aTokenImpl,
      reserveFactor,
      borrowCap,
      supplyCap,
    };
    const token = filteredTokens[element.symbol]!; // It must exists because we already filtered in filteredStrategies

    ReserveAssets[element.symbol] = token.address;
    LendingRateOracleRatesCommon[element.symbol] = {
      borrowRate: element.strategy.baseStableBorrowRate,
    };
  });

  const marketConfig: IMarketConfig = {
    ATokenNamePrefix: 'Hadouken interest bearing',
    StableDebtTokenNamePrefix: 'Hadouken stable debt bearing',
    VariableDebtTokenNamePrefix: 'Hadouken variable debt bearing',
    ReservesConfig,
    ReserveAssets,
    LendingRateOracleRatesCommon,
    IncentivesController: ZERO_ADDRESS,
    OracleQuoteUnit: oneEther.toString(),
    OracleQuoteCurrency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  };

  return marketConfig;
};
