declare namespace NodeJS {
  interface ProcessEnv {
    CLI_ACCOUNT: string;
    GODWOKEN_TESTNET_DEPLOYER: string;
    GODWOKEN_MAINNET_DEPLOYER: string;
    ZKSYNC_TESTNET_DEPLOYER: string;
    MANTLE_TESTNET_DEPLOYER: string;
    GNOSIS_SAFE: string;
  }
}
