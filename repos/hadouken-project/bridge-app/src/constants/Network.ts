import { GodwokenOverrides } from './Godwoken'

export const NetworkOverrides = GodwokenOverrides

export enum Network {
  Mainnet = '0x1',
  Kovan = '0x2a',
  Ropsten = '0x3',
  Rinkeby = '0x4',
  Goerli = '0x5',
  Dev = '0x539',
  BscTestnet = '0x61',
  BscMainnet = '0x38',
  GodwokenMainnet = '0x116ea',
  GodwokenTestnet = '0x116e1',
  GodwokenDevnet = '0xfa309',
}

export const NetworkName = {
  '0x1': 'Ethereum',
  '0x2a': 'Kovan',
  '0x3': 'Ropsten',
  '0x4': 'Rinkeby',
  '0x5': 'Goerli',
  '0x539': 'Dev',
  '0x38': 'Binance Smart Chain',
  '0x61': 'Binance Smart Chain Testnet',
  '0x116ea': 'Godwoken',
  '0x116e9': 'Godwoken v1',
  '0x116e1': 'Godwoken Testnet',
  '0xfa309': 'Godwoken Devnet',
}
