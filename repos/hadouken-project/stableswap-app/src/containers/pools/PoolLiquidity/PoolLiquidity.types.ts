import { IPool } from '@interfaces/pool'

export interface IPoolLiquidityContainerProps {
  poolId: IPool['id']
}

export enum LiquidityToggle {
  AllLiquidity = 'AllLiquidity',
  MyLiquidity = 'MyLiquidity',
}

export type ToggleValue = {
  [LiquidityToggle.MyLiquidity]: number
  [LiquidityToggle.AllLiquidity]: number
}
