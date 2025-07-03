export enum AssetName {
  EUR = "EUR",
  USD = "USD",
  BTC = "BTC",
  ETH = "ETH",
  ATOM = "ATOM",
  JLT = "JLT",
  JLT_F23 = "JLT_F23",
  "JLT-F23" = "JLT-F23",
  JLT_B23 = "JLT_B23",
  "JLT-B23" = "JLT-B23",
  MATIC = "MATIC",
  MATIC_POLYGON = "MATIC_POLYGON",
  DEFAULT = "DEFAULT",
}

export enum AccountingType {
  Regular = "regular",
  Trading = "trading",
}

export type AssetConfigEntry = {
  code: AssetName;
  isFiat: boolean;
  minAmount: number;
  pricePrecision: number;
  priceIncrement: number;
  priceDecimals: number;
  amountPrecision: number;
  amountIncrement: number;
  walletLabel: string;
  native?: boolean;
  displayed?: boolean;
  description?: string;
  icon?: string;
  accountingType?: AccountingType;
  balanceCode?: string;
};

export type AssetConfigProps = {
  [key: string]: AssetConfigEntry;
};

const defaultConfig = {
  isFiat: false,
  minAmount: 2,
  pricePrecision: 2,
  priceIncrement: 0.01,
  priceDecimals: 2,
  amountPrecision: 2,
  amountIncrement: 0.01,
  walletLabel: "",
  displayed: true,
  accountingType: AccountingType.Trading,
};

export const AssetConfig: AssetConfigProps = {
  [AssetName.EUR]: {
    ...defaultConfig,
    code: AssetName.EUR,
    isFiat: true,
    description: "Euro",
    icon: AssetName.EUR,
    minAmount: 15,
  },
  [AssetName.USD]: {
    ...defaultConfig,
    code: AssetName.USD,
    description: "US Dollar",
    icon: AssetName.USD,
    isFiat: true,
    minAmount: 15,
  },
  [AssetName.BTC]: {
    ...defaultConfig,
    code: AssetName.BTC,
    minAmount: 12,
    amountPrecision: 5,
    amountIncrement: 0.00001,
  },
  [AssetName.ETH]: {
    ...defaultConfig,
    code: AssetName.ETH,
    minAmount: 8,
    amountPrecision: 4,
    amountIncrement: 0.0001,
  },
  [AssetName.ATOM]: {
    ...defaultConfig,
    code: AssetName.ATOM,
    minAmount: 6,
    pricePrecision: 3,
    priceDecimals: 3,
    priceIncrement: 0.001,
  },
  [AssetName.JLT]: {
    ...defaultConfig,
    code: AssetName.JLT,
    accountingType: AccountingType.Trading,
    walletLabel: "JLT-AUX",
  },
  [AssetName["JLT-F23"]]: {
    ...defaultConfig,
    code: AssetName["JLT-F23"],
    description: "Voluntary REC Front - Half 2023",
    icon: AssetName["JLT-F23"],
    accountingType: AccountingType.Trading,
    walletLabel: "JLT_F23-AUX",
    priceDecimals: 18,
    balanceCode: AssetName.JLT_F23,
  },
  [AssetName.JLT_F23]: {
    ...defaultConfig,
    code: AssetName.JLT_F23,
    description: "Voluntary REC Front - Half 2023",
    icon: AssetName.JLT_F23,
    accountingType: AccountingType.Trading,
    walletLabel: "JLT_F23-AUX",
    priceDecimals: 18,
    balanceCode: AssetName.JLT_F23,
  },
  [AssetName["JLT-B23"]]: {
    ...defaultConfig,
    code: AssetName["JLT-B23"],
    description: "Voluntary REC Back - Half 2023",
    icon: AssetName.JLT_B23,
    accountingType: AccountingType.Trading,
    walletLabel: "JLT_B23-AUX",
    priceDecimals: 6,
    balanceCode: AssetName.JLT_B23,
  },
  [AssetName.JLT_B23]: {
    ...defaultConfig,
    code: AssetName.JLT_B23,
    description: "Voluntary REC Back - Half 2023",
    icon: AssetName.JLT_F23,
    accountingType: AccountingType.Trading,
    walletLabel: "JLT_B23-AUX",
    priceDecimals: 6,
    balanceCode: AssetName.JLT_B23,
  },
  [AssetName.MATIC]: {
    ...defaultConfig,
    code: AssetName.MATIC,
    displayed: false,
    walletLabel: "MATIC-AUX",
  },
  [AssetName.MATIC_POLYGON]: {
    ...defaultConfig,
    code: AssetName.MATIC_POLYGON,
    displayed: false,
    walletLabel: "MATIC-AUX",
  },
  DEFAULT: {
    ...defaultConfig,
    code: AssetName.DEFAULT,
  },
};

export const defaultBaseAsset =
  AssetConfig[process.env.NEXT_PUBLIC_DEFAULT_MARKET_BASE as string];
export const defaultQuoteAsset =
  AssetConfig[process.env.NEXT_PUBLIC_DEFAULT_MARKET_QUOTE as string];

export const getAssetDetails = (asset: string) =>
  AssetConfig[asset?.toUpperCase()] ?? AssetConfig.DEFAULT;

const mvpAvailableAssetsCodes =
  process.env.NEXT_PUBLIC_ASSETS?.split(",") ?? [];
export const mvpAvailableAssets = mvpAvailableAssetsCodes.map(
  (a) => AssetConfig[a]
);

const mvpAvailableAssetsCodesVisible =
  process.env.NEXT_PUBLIC_ASSETS_VISIBLE?.split(",") ?? [];
export const mvpAvailableAssetsWithoutTxToken =
  mvpAvailableAssetsCodesVisible.map((a) => AssetConfig[a]);

// TODO: Remove these functions if the API is fixed
export const isJltAsset = (asset: string) =>
  [
    AssetName.JLT,
    AssetName.JLT_F23,
    AssetName["JLT-F23"],
    AssetName.JLT_B23,
    AssetName["JLT-B23"],
  ].includes(asset.toUpperCase() as AssetName);

export const areAssetsEqual = (asset1: string, asset2: string) => {
  if (asset1.toUpperCase() === asset2.toUpperCase()) return true;

  return isJltAsset(asset1) && isJltAsset(asset2);
};

export const toUnderscore = (asset: string) => asset.replace("-", "_");

export const toDash = (asset: string) => asset.replace("_", "-");
