import React, { ReactNode } from 'react'

import { BigNumber } from 'ethers'

export interface Explorer {
  name: string
  url: string
}

export interface IComponent {
  testId?: string
  id?: string
}

export interface IIcon {
  onClick?: () => void
  fill?: string
  style?: React.CSSProperties
}

export interface ISvg {
  height?: number
  width?: number
  fill?: string
}

export interface ISvgRenderer {
  icon: React.FC<ISvg>
}

export interface IModal {
  title?: string
  open: boolean
  handleClose?: () => void
}

export type Address = string

export interface TokenModel {
  id: Address
  address: Address
  name: string
  symbol: string
  decimals: number
}

export interface IOperation {
  id: string
  title: string
  description: string
  status: OperationStatus
}

export enum OperationStatus {
  Waiting,
  Pending,
  Success,
  Fail,
  Aborted,
}

export enum TransactionStatus {
  Pending,
  Success,
  Fail,
}

export interface TokenModelBalance extends TokenModel {
  balance: BigNumber
}

export interface TokenModelBalanceWithIcon extends TokenModelBalance {
  icon?: ReactNode
  hideBalance?: boolean
}

export interface IPoolToken extends TokenModel {
  isLpToken?: boolean
  balance?: string
  poolId?: {
    id: string
  }
}

export enum NetworkEnum {
  Ethereum = 'Ethereum',
  CKB = 'CKB',
  Godwoken = 'Godwoken',
  Faucet = 'Faucet',
}

export interface IChain {
  id: number
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  chainId: string
  blockExplorerUrls: string[]
  rpcUrls: string[]
  logo: string
  borderColor: string
  isDefault?: boolean
  poolTokenSymbol?: string
}
