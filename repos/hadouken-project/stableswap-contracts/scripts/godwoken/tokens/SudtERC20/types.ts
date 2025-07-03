export interface SudtERC20DeploymentData {
  [key: string]: string,
}

export interface SudtERC20Parameters {
  name: string
  symbol: string
  decimals: number
  sudtId: number
}

export type SudtERC20Data = SudtERC20Parameters[]