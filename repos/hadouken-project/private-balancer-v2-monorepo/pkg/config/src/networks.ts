export const Network = {
  Ethereum: '0x1',
  Kovan: '0x2a',
  Rinkeby: '0x4',
  Goerli: '0x5',
  Dev: '0x539',
  BscTestnet: '0x61',
  BscMainnet: '0x38',
  GodwokenMainnet: '0x116ea',
  GodwokenTestnet: '0x116e9',
  GodwokenDevnet: '0x116e8',
  ZksyncTestnet: '0x118',
  ZksyncMainnet: '0x144',
  ZksyncLocal: '0x10e',
  MantleTestnet: '0x1389',
  MantleMainnet: '0x1388',
} as const;

export type ChainId = typeof Network | (typeof Network)[keyof typeof Network] | string;
