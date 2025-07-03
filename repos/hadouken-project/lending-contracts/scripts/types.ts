import {
  AaveProtocolDataProvider as GodwokenAaveProtocolDataProvider,
  LendingPoolAddressesProvider as GodwokenLendingPoolAddressesProvider,
} from '@src/typechain/godwoken';
import {
  AaveProtocolDataProvider as ZkSyncAaveProtocolDataProvider,
  LendingPoolAddressesProvider as ZkSyncLendingPoolAddressesProvider,
} from '@src/typechain/zksync';
import { IMarketConfig, IReserveParams, iMultiPoolsAssets, tEthereumAddress } from '@src/types';

export type PoolTokens = {
  aTokenAddress: string;
  stableTokenAddress: string;
  variableTokenAddress: string;
  tokensAndRatesAddress: string;
  stableAndVariableTokensHelperAddress: string;
};

export type InitializeReservesByHelperProps = {
  addressProvider: GodwokenLendingPoolAddressesProvider | ZkSyncLendingPoolAddressesProvider;
  reservesParams: iMultiPoolsAssets<IReserveParams>;
  tokenAddresses: { [symbol: string]: tEthereumAddress };
  aTokenNamePrefix: string;
  stableDebtTokenNamePrefix: string;
  variableDebtTokenNamePrefix: string;
  treasuryAddress: tEthereumAddress;
  incentivesController: tEthereumAddress;
  poolConfigAddress: tEthereumAddress;
  aTokenAddress: tEthereumAddress;
  stableTokenAddress: tEthereumAddress;
  variableTokenAddress: tEthereumAddress;
};

export interface ConfigureReservesByHelperProps {
  reservesParams: iMultiPoolsAssets<IReserveParams>;
  tokenAddresses: { [symbol: string]: tEthereumAddress };
  helpers: GodwokenAaveProtocolDataProvider | ZkSyncAaveProtocolDataProvider;
  admin: tEthereumAddress;
}

export type InitializationProps = {
  addressProviderAddress: tEthereumAddress;
  configuratorAddress: tEthereumAddress;
  aTokenAddress: tEthereumAddress;
  treasuryAddress: tEthereumAddress;
  stableTokenAddress: tEthereumAddress;
  variableTokenAddress: tEthereumAddress;
  dataProviderAddress: tEthereumAddress;
  tokensAndRatesAddress: tEthereumAddress;
  marketConfig: IMarketConfig;
};

export type LendingPoolLibraries = {
  reserve: string;
  generic: string;
  validation: string;
};
