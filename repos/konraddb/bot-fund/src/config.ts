import { ChainId } from "@tvl-labs/fund-wallet-script";

export type RpcUrlsConfig = {
  rpcUrls: {
    chain: ChainId;
    url: string;
  }[];
};

export type AddressesConfig = {
  addresses: {
    name: string;
    chain: ChainId;
    address: string;
  }[];
};
