export enum AppRoutes {
  HOME = "/",
  MARKETS = "/markets",
  TRADE = "/trade",
  ACCOUNT = "/account",
  POOL = "/pool",
  RETIRE = "/retire",
  BRIDGE = "/bridge",
  TERMS = "/terms",
}

export enum ApiRoutes {
  // DLT api
  LOGIN_CREDENTIALS = "/api/f/login",
  LOGIN_VERIFY_CODE = "/api/f/check2fa",
  USER_PROFILE = "/api/v1.1/me",
  CUSTOMERS = "/api/v1.1/customers",
  ASSIGNED_ASSETS = `/api/v1.1/trade/rfq/%clientCode%/assigned`,
  ASSETS_LIST = "/api/v1.1/custody/currencies",
  CRYPTO_DEPOSIT_ADRESSESS = "/api/v1.1/custody/%clientId%/wallets?limit=1000&state=all",
  DEPOSITS_HISTORY = "/api/v1.1/custody/deposits?sort_by=compliance_received_at&sort_direction=desc",
  ORDERS = "/api/v1.1/orders",
  BALANCES = "api/v1.1/trade/balances/customers/",
  REQUEST_WHITELIST_ADDRESS = "/api/v1.1/custody/withdrawals/addresses",
  CRYPTO_WITHDRAWAL_ADDRESSESS = "/api/v1.1/custody/withdrawals/addresses?clientCode=&limit=1000&page=1&sort_direction=desc&sort_by=created",
  WITHDRAWALS_HISTORY = "/api/v1.1/custody/withdrawals?sort_by=created&clientCode=&limit=1000&page=1&sort_direction=desc",
  REQUEST_WITHDRAWAL = "/api/v1.1/custody/withdrawals",
  CREATE_WALLET = "/api/v1.1/custody/wallets",
  REQUEST_WITHDRAWAL_DELETE = "/api/v1.1/custody/withdrawals/%withdrawalId%",
  REQUEST_ADDRESS_DELETE = "/api/v1.1/custody/withdrawals/addresses/%addressId%",
  API_TOKENS = "api/f/user/api_tokens",
  TOTP_SECRET = "/api/f/invites",
  CREATE_ACCOUNT = "/api/f/registration",
  USERS = "api/v1.1/users",
  POOL_STRATEGIES = "/api/v1.1/defi/strategies",
  POOL_STRATEGY = "/api/v1.1/defi/strategy",
  POOL_STRATEGY_ASSETS = "/api/v1.1/defi/strategy/%strategyCode%/assets",
  POOL_STRATEGY_BALANCES = "/api/v1.1/defi/strategy/%strategyCode%/balances",
  POOL_INTERNAL_TRANSFER = "/api/v1.1/internal_transfers",
  POOL_ELIGIBILITY = "/api/v1.1/defi/contract/%strategyCode%/%tokenAddress%/meetsPolicy?tokenId=%tokenId%",
  CONTRACT_CALL = "/api/v1.1/defi/contract/call",
  TRANSACTION_STATUS = "/api/v1/transaction/%transactionHash%/status",
  BRIDGEOFF_ELIGIBILITY = "/api/v1.1/defi/contract/%strategyCode%/%contractAddress%/%methodName%",

  // Neutral API
  ACCEPT_TERMS_AND_CONDITIONS = "/api/v1/terms-and-conditions/accept",
  DOWNLOAD_HISTORY = "/api/v1/history/trade",
  NEUTRAL_LOGIN = "/api/v1/user/login",
  NEUTRAL_RENEW_TOKEN = "/api/v1/user/refresh",
  INVITE = "/api/v1/user/invite",
  CONFIRM_RETIRE = "/api/v1/jasmine/bridge/retirement-info",
  BRIDGE_REQUESTS = "/api/v1/jasmine/bridge/requests",
  NEUTRAL_BRIDGE_SIGNATURE = "/api/v1/jasmine/bridge/request/%certificateId%",
  BRIDGE_HISTORY = "/api/v1/jasmine/bridge/history",

  // Jasmine API routes
  JASMINE_POOL_DEPOSITS = `/v1/jlt/%address%/deposits`,
  JASMINE_TOKEN_METADATA = "/v1/eat/%tokenId%.json",

  // Internal API routes
  VERSION = "/api/version",
}

export const StaticRoutes = {
  ASSET_ICONS: "/icons/assets",
  ICONS: "/icons/general",
  USER_ADMIN: "/icons/general/user-admin.svg",
  USER_TRADER: "/icons/general/user-trader.svg",
};

export enum ExternalRoutes {
  CFPB = "/",
  CFTC = "/",
  SEC = "/",
  FINRA = "/",
}
