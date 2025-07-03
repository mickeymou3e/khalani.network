export type Environments = 'mainnet' | 'testnet' | 'localhost';

// In lower case only !!
export enum Network {
  Mainnet = '0x1',
  Ropsten = '0x3',
  Kovan = '0x2a',
  Rinkeby = '0x4',
  Goerli = '0x5',
  Dev = '0x116e8',
  Godwoken = '0x116e2',
  GodwokenTestnet = '0xfa309',
  GodwokenDevnetV1 = '0x116e8',
  GodwokenTestnetV1 = '0x315db00000006',
  GodwokenTestnetV1_1 = '0x116e9',
  GodwokenMainnetV1 = '0x116ea',
  ZkSyncMainnet = '0x144',
  ZkSyncTestnet = '0x118',
  ZkSyncLocalhost = '0x10e',
  MantleTestnet = '0x1389',
  MantleMainnet = '0x1388',
}

export interface IToken {
  name?: string;
  symbol: string;
  displaySymbol: string;
  decimals?: number;
  address: string;
  initialValue?: string;
}

export interface DeployedToken {
  address: string;
  aTokenAddress?: string;
  stableDebtTokenAddress?: string;
  variableDebtTokenAddress?: string;
}

export interface Tokens {
  [key: string]: DeployedToken;
}

export interface IContractsConfig {
  tokens: Tokens;
  registry: string;
  registryProvider: string;
  addressProvider: string;
  libraries: {
    reserve: string;
    generic: string;
    validation: string;
  };
  lendingPool: string;
  lendingPoolProxy: string;
  poolConfigurator: string;
  poolConfiguratorProxy: string;
  treasury: string;
  hadoukenCollector: string;
  aToken: string;
  stableDebtToken: string;
  variableDebtToken: string;
  aTokenAndRateHelper: string;
  stableAndVariableTokensHelper: string;
  lendingRateOracle: string;
  diaOracle: string;
  diaOracleProvider: string;
  oracleBrandProvider: string;
  hadoukenOracle: string;
  dataProvider: string;
  collateralManager: string;
  stdReference: string;
  firstBlockNumber?: number;
  lastBlockNumber?: number;
  userBalances: string;
  UIHelper: string;
  testBProtocol?: string;
  wEthGateway?: string;
}

export interface Config {
  env: string;
  network: string;
  chainId: string;
  marketId: string;
  deployer: string;
  gasPrice?: number;
  gasLimit?: number;
  isGnosisSafe: boolean;
  delay: string;
  rpcUrl: string;
  readOnlyRpcUrl: string;
  wsUrl: string;
  explorer: string;
  nervos?: {
    ckb: {
      url: string;
    };
    indexer: {
      url: string;
    };
    rc_lock_script_type_hash: string;
    rollup_type_hash: string;
    rollup_type_script: {
      code_hash: string;
      hash_type: string;
      args: string;
    };
    eth_account_lock_hash: string;
    deposit_lock_script_type_hash: string;
    portal_wallet_lock_hash: string;
  };
  nativeToken: {
    symbol: string;
    address: string;
    displaySymbol: string;
    wrapAddress: string | null;
  };
  tokens?: IToken[];
  bandOracleStdReference: string;
  diaOracleV2: string;
  gnosisSafe?: string;
  gnosisApi?: string;
}
