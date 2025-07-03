import React from 'react'

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
  bgFill?: string
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
  chainId?: IChain['chainId']
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

export enum ETransactionStatus {
  Pending,
  Success,
  Fail,
}

export interface TokenModelBalance extends TokenModel {
  balance: bigint
}

export interface IPoolToken extends TokenModel {
  isLpToken?: boolean
  balance?: string
  poolId?: {
    id: string
  }
}

export interface IUSDAmount {
  value: bigint
  decimals: number
}

export enum NetworkEnum {
  Ethereum = 'Ethereum',
  CKB = 'CKB',
  Godwoken = 'Godwoken',
  Faucet = 'Faucet',
}

export enum ENetwork {
  Ethereum = 1,
  BscMainnet = 38,
  BscTestnet = 97,
  OptimismSepolia = 11155420,
  Khalani = 1098411886,
  AvalancheTestnet = 43113,
  Avalanche = 43114,
  GodwokenTestnet = 71401,
  MumbaiTestnet = 80001,
  ArbitrumSepolia = 421614,
  ArbitrumOne = 42161,
  ArcadiaMainnet = 4278608,
  EthereumSepolia = 11155111,
  Holesky = 17000,
  BaseSepolia = 84532,
  BaseMainnet = 8453,
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
