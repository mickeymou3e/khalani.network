export interface ERC20DeploymentData {
  [key: string]: string,
}

export interface ERC20Parameters {
  name: string
  symbol: string
  decimals: number
}

export type ERC20Data = ERC20Parameters[]