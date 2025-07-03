import { EthereumNetwork, GodwokenNetwork } from "../types";

export type TokensData = {
  ERC20?: {
    [key: string]: string,
  },
  SudtERC20?: {
    [key: string]: string,
  },
  HadoukenToken?: {
    [key: string]: string,
  },
  wCKB?: {
    [key: string]: string,
  },
  ForceBridgeERC20?: {
    [key: string]: string,
  },
}


export type TokensDataByNetwork = {
  [key in EthereumNetwork | GodwokenNetwork]?: TokensData
}
