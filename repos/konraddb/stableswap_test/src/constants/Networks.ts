import { GodwokenOverrides } from './Godwoken'

export const NetworkOverrides = GodwokenOverrides

export enum Network {
  Ethereum = '0x1',
  Kovan = '0x2a',
  Rinkeby = '0x4',
  Goerli = '0x5',
  Dev = '0x539',
  BscTestnet = '0x61',
  BscMainnet = '0x38',
  GodwokenMainnet = '0x116ea',
  GodwokenTestnet = '0x116e9',
  GodwokenDevnet = '0x116e8',
  AvalancheTestnet = '0xa869',
  Axon = '0x271c',
}

export const NetworkName = {
  '0x1': 'Ethereum',
  '0x2a': 'Kovan',
  '0x4': 'Rinkeby',
  '0x5': 'Goerli',
  '0x539': 'Dev',
  '0x38': 'Binance Smart Chain',
  '0x61': 'Binance Smart Chain Testnet',
  '0x116ea': 'Godwoken',
  '0x116e9': 'Godwoken Testnet',
  '0x116e8': 'Godwoken Devnet',
  '0xa869': 'Avalanche Testnet',
  '0x271c': 'Axon',
}

export const CONFIRMATIONS = 2
