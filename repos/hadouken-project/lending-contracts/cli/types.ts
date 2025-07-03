export enum CLI_COMMANDS {
  administration,
  tokens,
  pools,
  pool,
  oracle,
  registries,
  deploy,
  transfer,
  liquidation,
  all,
}

export enum CLI_COMMANDS_NEW {
  administration = 'Administration',
  oracle = 'Oracle',
  reserves = 'Reserves',
  tokens = 'Tokens',
  deploy = 'Deploy',
  liquidation = 'Liquidation',
}

export enum TOKENS_CLI_COMMANDS {
  mint = 'Mint',
  balance = 'Balance',
  transfer = 'Transfer',
  list = 'List',
}

// { title: 'tokens', value: 'tokens' },
// { title: 'update lending tokens address', value: 'lending-tokens' },

export enum DEPLOY_CLI_COMMANDS {
  addressProvider = 'address provider',
  treasury = 'Treasury',
  registry = 'Registry',
  libraries = 'Libraries',
  lendingPool = 'Lending Pool',
  lendingPoolConfigurator = 'Lending pool configurator',
  oracle = 'oracle',
  dataProvider = 'Data provider',
  userBalances = 'User balances',
  collateralManager = 'Collateral manager',
  uiHelper = 'UI helper',
  registryProvider = 'registryProvider',
  initializePool = 'Initialize pool',
  poolTokens = 'Pool tokens',
  underlyingTokens = 'Underlying tokens',
  wEthGateway = 'WEth Gateway',
  all = 'All',
}

export enum RESERVE_CLI_COMMANDS {
  getBorrowCap = 'Get borrow cap',
  getDepositCap = 'Get deposit cap',

  setBorrowCap = 'Set borrow cap',
  setDepositCap = 'Set deposit cap',

  getConfiguration = 'Get reserve configuration',
  setConfiguration = 'Set reserve configuration',

  freeze = 'Freeze/Unfreeze',
  enable = 'Enable',
  enableBorrow = 'Enable borrow',
  enableStableBorrow = 'Enable stable borrow',

  getInterestRateStrategy = 'Get interest rate strategy',
  setInterestRateStrategy = 'Set interest rate strategy',
  updateInterestRateStrategy = 'Update interest rate strategy',

  getBProtocol = 'Get BProtocol address',
  setBProtocol = 'Set BProtocol address',
}

export enum PRICE_CLI_COMMANDS {
  hadoukenOracle = 'Hadouken oracle',
  bandProvider = 'Band provider',
  diaProvider = 'DIA  provider',
  bandOracle = 'Band oracle',
  diaOracle = 'DIA oracle',
}

export enum ORACLE_CLI_COMMANDS {
  getPrice = 'Get price',
  updatePrice = 'Update price',
}

export enum ADMINISTRATION_CLI_COMMANDS {
  owner = 'Owner',
  admin = 'Admin',
  emergency = 'Emergency',
  shutdown = 'Shutdown',
  hadoukenOracle = 'Hadouken Oracle',
  diaOracleProvider = 'DIA oracle provider',
  bandOracleProvider = 'Band oracle provider',
  aTokenAndRateHelper = 'ATokenAndRateHelper',
  backstop = 'backstop',
  stableAndVariableTokenHelper = 'Stable and Variable token helper',
  treasury = 'Treasury',

  addReserve = 'Add Reserve',
  revision = 'Revision',
  setImplementation = 'Set Implementation',
}

export enum OWNER_CLI_COMMANDS {
  getOwner = 'Get pool owner',
  setOwner = 'Set pool owner',
  getPoolAdmin = 'Get pool admin',
  setPoolAdmin = 'Set pool admin',
}

export enum ADMIN_CLI_COMMANDS {
  getPoolAdmin = 'Get pool admin',
  setPoolAdmin = 'Set pool admin',
}

export enum EMERGENCY_CLI_COMMANDS {
  getEmergency = 'Get emergency',
  setEmergency = 'Set emergency',
}

export enum ADMIN_ORACLE_CLI_COMMANDS {
  getHadoukenOracleOwner = 'Get Hadouken oracle owner',
  setHadoukenOracleOwner = 'Set Hadouken oracle owner',

  getLendingRateOracleOwner = 'Get Lending Rate oracle owner',
  setLendingRateOracleOwner = 'Set Lending Rate oracle owner',

  getDiaOracleProviderOwner = 'Get DIA oracle provider owner',
  setDiaOracleProviderOwner = 'Set DIA oracle provider owner',

  getBandOracleProviderOwner = 'Get Band oracle provider owner',
  setBandOracleProviderOwner = 'Set Band oracle provider owner',
}

export enum A_TOKEN_AND_RATE_HELPER_CLI_COMMANDS {
  getOwner = 'Get ATokenAndRateHelper Owner',
  setOwner = 'Set ATokenAndRateHelper Owner',
}

export enum STABLE_AND_VARIABLE_TOKEN_HELPER_CLI_COMMANDS {
  getOwner = 'Get StableAndVariableTokenHelper Owner',
  setOwner = 'Set StableAndVariableTokenHelper Owner',
}

export enum BACKSTOP_CLI_COMMANDS {
  getBackstop = 'Get Backstop',
  setBackstop = 'Set Backstop',
}

export enum TREASURY_CLI_COMMANDS {
  getOwner = 'Get Owner',
  setOwner = 'Set Owner',
}

export enum POOL_CLI_COMMANDS {
  administration,
  emergencyShutdown,
  poolAdmin,
  getPoolAdmin,
  setPoolAdmin,
  emergencyAdmin,
  getEmergencyAdmin,
  setEmergencyAdmin,
  poolOwner,
  getPoolOwner,
  setPoolOwner,
  reserve,
  freezeReserve,
  enableReserve,
  enableBorrowReserve,
  enableStableRateBorrow,
  configureReserve,
  getConfiguration,
  addReserve,
  getReserveList,
  getInterestRateStrategy,
  changeInterestRateStrategy,
  updateInterestRateStrategy,
  setBorrowCap,
  setDepositCap,
  BProtocol,
  setBProtocol,
  getBProtocol,
  setLendingPoolImpl,

  addressProviderRegistry,
  stableAndVariableTokensHelper,
  hadoukenOracle,
  diaOracleProvider,
  bandOracleProvider,
  aTokenAndRateHelper,
  lendingRateOracle,
  treasury,
  getOwner,
  setOwner,

  HadoukenCollectorOwner,
  HadoukenCollectorRedeploy,
  HadoukenCollectorUpgrade,
  HadoukenCollectorTransfer,
  HadoukenCollectorTransferOwnership,
}
