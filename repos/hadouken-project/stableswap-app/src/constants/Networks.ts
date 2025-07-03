import { BigNumber } from 'ethers'

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
  ZksyncTestnet = '0x118',
  ZksyncMainnet = '0x144',
  ZksyncLocal = '0x10e',
  MantleTestnet = '0x1389',
  MantleMainnet = '0x1388',
}

export const NetworkName = {
  '0x1': 'Ethereum',
  '0x2a': 'Kovan',
  '0x4': 'Rinkeby',
  '0x5': 'Goerli',
  '0x539': 'Dev',
  '0x38': 'Binance Smart Chain',
  '0x61': 'Binance Smart Chain Testnet',
  '0x116ea': 'Godwoken Mainnet V1',
  '0x116e9': 'Godwoken Testnet V1_1',
  '0x116e8': 'Godwoken Devnet',
  '0x118': 'zkSync Testnet',
  '0x144': 'zkSync Mainnet',
  '0x10e': 'zkSync Devnet',
  '0x1389': 'Mantle Testnet',
  '0x1388': 'Mantle Mainnet',
}

export const CONFIRMATIONS = 1

export const MaxUint256: BigNumber = /*#__PURE__*/ BigNumber.from(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
)
