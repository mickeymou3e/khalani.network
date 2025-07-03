export type ChainEnvironment =
  | "godwoken-mainnet"
  | "godwoken-testnet"
  | "zksync-testnet"
  | "zksync-mainnet"
  | "mantle-testnet"
  | "mantle-mainnet";

export type Environment = "mainnet" | "testnet";

export type ContractsConfig = {
  backstop: string;
  liquidation: string;
};

// In lower case only !!
export enum Network {
  Mainnet = "0x1",
  Ropsten = "0x3",
  Kovan = "0x2a",
  Rinkeby = "0x4",
  Goerli = "0x5",
  Dev = "0x116e8",
  GodwokenTestnet = "0x116e9",
  GodwokenMainnet = "0x116ea",
  ZkSyncMainnet = "0x144",
  ZkSyncTestnet = "0x118",
  ZkSyncLocalhost = "0x10e",
  MantleTestnet = "0x1389",
  MantleMainnet = "0x1388",
}
