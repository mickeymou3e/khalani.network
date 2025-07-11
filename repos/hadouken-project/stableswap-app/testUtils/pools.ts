import { IPool, PoolType } from '@interfaces/pool'
import { BigDecimal } from '@utils/math'

import {
  TEST_BNB_BINANCE_TOKEN,
  TEST_BOOSTED_POOL_TOKEN,
  TEST_BOOSTED_USDT_BINANCE_TOKEN,
  TEST_BUSD_BINANCE_TOKEN,
  TEST_BUSD_TOKEN,
  TEST_CELER_BOOSTED_POOL_TOKEN,
  TEST_CELER_USDC_TOKEN,
  TEST_CELER_USDT_TOKEN,
  TEST_CKB_TOKEN,
  TEST_DCKB_TOKEN,
  TEST_ETH_TOKEN,
  TEST_H_CKB_TOKEN,
  TEST_H_ETH_TOKEN,
  TEST_H_USDC_TOKEN,
  TEST_H_USDT_TOKEN,
  TEST_H_WBTC_TOKEN,
  TEST_LNR_CKB_TOKEN,
  TEST_LNR_ETH_TOKEN,
  TEST_LNR_USDC_TOKEN,
  TEST_LNR_USDT_TOKEN,
  TEST_LNR_WBTC_TOKEN,
  TEST_USDC_BSC_TOKEN,
  TEST_USDC_TOKEN,
  TEST_USDT_BINANCE_TOKEN,
  TEST_USDT_TOKEN,
  TEST_WBTC_TOKEN,
} from './tokens'

export const pools: IPool[] = [
  {
    id: '0x003ab2a164fcd7b5384c8bf4939806f11a1dc32d000000000000000000000009',
    address: '0x003ab2a164fcd7b5384c8bf4939806f11a1dc32d',
    name: 'USDC Linear Pool',
    displayName: 'USDC Linear Pool',
    symbol: 'HDK-LNR-USDC',
    decimals: 18,
    poolType: PoolType.AaveLinear,
    tokens: [
      {
        ...TEST_LNR_USDC_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0xffffffb5b0caf96e0b65f9ed9ba7', 18),
      },
      {
        ...TEST_USDC_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x51a352b9a8e0', 6),
      },
      {
        ...TEST_H_USDC_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x29b68ea48a', 6),
      },
    ],
    amp: '',
    owner: '',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x05543df729c000', 18),
    totalShares: BigDecimal.from('0x4a4f350691f49a06126458', 18),
    totalLiquidity: BigDecimal.from('0x4a65e76236ee67c5653614', 18),
    totalSwapFee: BigDecimal.from('0x0cf277111f67825100', 18),
    totalSwapVolume: BigDecimal.from('0x21b76b6741c838b2f000', 18),
  },
  {
    id: '0x086dd8f69793100e745a9549bce68459e2c46f82000000000000000000000012',
    address: '0x086dd8f69793100e745a9549bce68459e2c46f82',
    name: 'USDT|BSC Stable Pool',
    symbol: 'HDK-Boosted-USD-USDT-BSC',
    decimals: 18,
    poolType: PoolType.ComposableStable,
    tokens: [
      {
        ...TEST_BOOSTED_USDT_BINANCE_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x7fffffffffe821fcb2804856917a', 18),
      },
      {
        ...TEST_BOOSTED_POOL_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de6c2bacc09deaf', 18),
        balance: BigDecimal.from('0x0c772c42ae7ced6bc2', 18),
      },
      {
        ...TEST_USDT_BINANCE_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x139c7ce11e66', 18),
      },
    ],
    displayName: 'Hadouken Boosted USD / USDT|BSC Stable Pool',
    amp: '300',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x05543df729c000', 18),
    totalShares: BigDecimal.from('0x17de034d7fb7a96e86', 18),
    totalLiquidity: BigDecimal.from('0x00', 18),
    totalSwapFee: BigDecimal.from('0x00', 18),
    totalSwapVolume: BigDecimal.from('0x00', 18),
  },
  {
    id: '0x0c31aa0331d64e93a9a9a5a6382d477e81d0992f000000000000000000000008',
    address: '0x0c31aa0331d64e93a9a9a5a6382d477e81d0992f',
    name: 'USDT Linear Pool',
    symbol: 'HDK-LNR-USDT',
    decimals: 18,
    poolType: PoolType.AaveLinear,
    tokens: [
      {
        ...TEST_LNR_USDT_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0xffffffe5e8059034b0e853848109', 18),
      },
      {
        ...TEST_USDT_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 6),
        balance: BigDecimal.from('0x0913d6cee015', 6),
      },
      {
        ...TEST_H_USDT_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0913d6cee015', 6),
      },
    ],
    amp: '',
    owner: '',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x05543df729c000', 18),
    totalShares: BigDecimal.from('0x1a17fa6fcb4f17ac7b7ef6', 18),
    totalLiquidity: BigDecimal.from('0x1a1c34500c4b363d5b9fae', 18),
    totalSwapFee: BigDecimal.from('0x154c9831a1f0deb67000', 18),
    totalSwapVolume: BigDecimal.from('0x37777701406343fb190000', 18),
    displayName: 'Hadouken Linear USDT Stable Pool',
  },
  {
    id: '0x20f3074c427cf348cad9c76c029ffe7107bd58dd000200000000000000000006',
    address: '0x20f3074c427cf348cad9c76c029ffe7107bd58dd',
    name: 'ETH/USDC Weighted Pool',
    symbol: 'HDK-ETH-USDC',
    decimals: 18,
    poolType: PoolType.Weighted,
    tokens: [
      {
        ...TEST_USDC_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x4cff8ebb1618c3', 6),
        isLpToken: false,
      },
      {
        ...TEST_ETH_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x021eb535a2fbdb492449', 18),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x1805c039d2cf3b36ac2a2e', 18),
    totalLiquidity: BigDecimal.from('0x4615aa832a2f6cd72198546b', 18),
    totalSwapFee: BigDecimal.from('0x43a77f874505aabfa1e400', 18),
    totalSwapVolume: BigDecimal.from('0x58176e0d7734b6543020e000', 18),
    displayName: 'Hadouken ETH/USDC Weighted Pool',
  },
  {
    id: '0x2677595a93a3f6378977a8753420dcdcd493a463000200000000000000000007',
    address: '0x2677595a93a3f6378977a8753420dcdcd493a463',
    name: 'WBTC/USDC Weighted Pool',
    symbol: 'HDK-WBTC-USDC',
    decimals: 18,
    poolType: PoolType.Weighted,
    tokens: [
      {
        ...TEST_USDC_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x02b419a9d076', 6),
      },
      {
        ...TEST_WBTC_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0b5f1d70ff', 8),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x1010f9184e6a431faf2b', 18),
    totalLiquidity: BigDecimal.from('0x02945b17acaf0a81af71de', 18),
    totalSwapFee: BigDecimal.from('0x088d8bd91bfbdde200', 18),
    totalSwapVolume: BigDecimal.from('0x0b22f8c2b1c548e8f000', 18),
    displayName: 'Hadouken WBTC/USDC Weighted Pool',
  },
  {
    id: '0x2856e0f3f5f0894d02f0e7a44be67cc451981ac9000100000000000000000001',
    address: '0x2856e0f3f5f0894d02f0e7a44be67cc451981ac9',
    name: 'CKB/ETH/USDC Weighted Pool',
    symbol: 'HDK-CKB-ETH-USDC',
    decimals: 18,
    poolType: PoolType.Weighted,
    tokens: [
      {
        ...TEST_USDC_TOKEN,
        weight: BigDecimal.from('0x0494654067e10000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x01ae6491e550', 6),
      },
      {
        ...TEST_CKB_TOKEN,
        weight: BigDecimal.from('0x04b7ec32d7a20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x01a4441677ba1f5424241e09', 18),
      },
      {
        ...TEST_ETH_TOKEN,
        weight: BigDecimal.from('0x0494654067e10000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x3ad0f9420ad5a4ab9b', 18),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x02a49d4de0ed715a8eb988', 18),
    totalLiquidity: BigDecimal.from('0x03585e755c79517bc84762b2bc', 18),
    totalSwapFee: BigDecimal.from('0x551dee1b25f3d087b2', 18),
    totalSwapVolume: BigDecimal.from('0x6ed44e08aec02230b0f7', 18),
    displayName: 'Hadouken CKB/ETH/USDC Weighted Pool',
  },
  {
    id: '0x296f997a69c49229234ca030c89340a000e20557000200000000000000000002',
    address: '0x296f997a69c49229234ca030c89340a000e20557',
    name: 'CKB/ETH Weighted Pool',
    symbol: 'HDK-CKB-ETH',
    decimals: 18,
    poolType: PoolType.Weighted,
    tokens: [
      {
        ...TEST_CKB_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x01517dc3f8a322915f7d', 18),
      },
      {
        ...TEST_ETH_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0129b813102f835510ef', 18),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x02783683ab88155a674d', 18),
    totalLiquidity: BigDecimal.from('0x08629dba13d84f9773657e', 18),
    totalSwapFee: BigDecimal.from('0x0105de634e84f340303d', 18),
    totalSwapVolume: BigDecimal.from('0x0154f9914e3d1cbb9425c8', 18),
    displayName: 'Hadouken CKB/ETH Weighted Pool',
  },
  {
    id: '0x2a0b5db0df1c4e93d25064f8f4b97100fb667b22000200000000000000000000',
    address: '0x2a0b5db0df1c4e93d25064f8f4b97100fb667b22',
    name: 'BNB/USDC Weighted Pool',
    symbol: 'HDK-BNB-USDC',
    decimals: 18,
    poolType: PoolType.Weighted,
    tokens: [
      {
        ...TEST_USDC_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x1cbd10604123e9', 6),
      },
      {
        ...TEST_BNB_BINANCE_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x07af061b01cdae8d00', 18),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x01c3a2c22895e84f0b383c', 18),
    totalLiquidity: BigDecimal.from('0x1a2335f087e808fae8fff1dd', 18),
    totalSwapFee: BigDecimal.from('0xee2ffc6ff4920cd200', 18),
    totalSwapVolume: BigDecimal.from('0x013623d0b1c67380b17000', 18),
    displayName: 'Hadouken BNB/USDC Weighted Pool',
  },
  {
    id: '0x3458cd69a35232b6d4bbfc16376c4ffb1ef9d302000000000000000000000016',
    address: '0x3458cd69a35232b6d4bbfc16376c4ffb1ef9d302',
    name: 'Linear WBTC',
    symbol: 'HDK-LNR-WBTC',
    decimals: 18,
    poolType: PoolType.AaveLinear,
    tokens: [
      {
        ...TEST_LNR_WBTC_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0xfffffffffff52861d53025cb057f', 18),
      },
      {
        ...TEST_WBTC_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x02540be400', 8),
      },
      {
        ...TEST_H_WBTC_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x02540be400', 8),
      },
    ],
    amp: '',
    owner: '',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x05543df729c000', 18),
    totalShares: BigDecimal.from('0x0ad79e2acfda34fa80', 18),
    totalLiquidity: BigDecimal.from('0x0653584f344d6d5c4a02', 18),
    totalSwapFee: BigDecimal.from('0x0', 18),
    totalSwapVolume: BigDecimal.from('0x0', 18),
    displayName: 'Linear WBTC',
  },
  {
    id: '0x3ef70956332a9dc5c0dc803f00bf6b6dd7e9e08b000200000000000000000019',
    address: '0x3ef70956332a9dc5c0dc803f00bf6b6dd7e9e08b',
    name: 'dCKB/CKB Weighted Pool Weighted Pool',
    symbol: 'HDK-dCKB-CKB',
    decimals: 18,
    poolType: PoolType.Weighted,
    tokens: [
      {
        ...TEST_CKB_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x3635c9adc5dea00000', 18),
      },
      {
        ...TEST_DCKB_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x174876e800', 8),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x6c6b935b8bbadda1ee', 18),
    totalLiquidity: BigDecimal.from('0x01c495fc87d2200957', 18),
    totalSwapFee: BigDecimal.from('0x0', 18),
    totalSwapVolume: BigDecimal.from('0x0', 18),
    displayName: 'dCKB/CKB Weighted Pool',
  },
  {
    id: '0x4b324bfa9f8a52dc1ae321ae1b744f036b8d05cd00000000000000000000000b',
    address: '0x4b324bfa9f8a52dc1ae321ae1b744f036b8d05cd',
    name: 'BUSD Stable Pool',
    symbol: 'HDK-BUSD',
    decimals: 18,
    poolType: PoolType.ComposableStable,
    tokens: [
      {
        ...TEST_BUSD_BINANCE_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0115be7c1830f124a371', 18),
      },
      {
        ...TEST_BUSD_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x7ffffffffdd48e8b4e09b80f47c6', 18),
      },
      {
        id: '0xdc40d03d15f5861f486fc4e81b6333e489d78195',
        address: '0xdc40d03d15f5861f486fc4e81b6333e489d78195',
        name: 'Force Bridge BUSD from Ethereum',
        symbol: 'BUSD',
        decimals: 18,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0115b343b64027549ca8', 18),

        isLpToken: false,
        displayName: 'BUSD',
        source: 'eth',
      },
    ],
    amp: '300',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),

    swapFee: BigDecimal.from('0x5af3107a4000', 18),
    totalShares: BigDecimal.from('0x022b7174b1f647f0b83a', 18),
    totalLiquidity: BigDecimal.from('0x00', 18),
    totalSwapFee: BigDecimal.from('0x00', 18),
    totalSwapVolume: BigDecimal.from('0x00', 18),
    displayName: 'BUSD Stable Pool',
  },
  {
    id: '0x58c7d8f659cd78da06fd4f7a991000fa472417b100000000000000000000000a',
    address: '0x58c7d8f659cd78da06fd4f7a991000fa472417b1',
    name: 'Hadouken Boosted USD',
    symbol: 'HDK-B-2Pool',
    decimals: 18,
    poolType: PoolType.ComposableStable,
    tokens: [
      {
        ...TEST_LNR_USDC_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0cdc212301c56', 18),
        balance: BigDecimal.from('0x4a3d59d4dcfa5119a1a8db', 18),
      },
      {
        ...TEST_LNR_USDT_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de2b2811185f88a', 18),
        balance: BigDecimal.from('0x1a08798babcb23d3cc7c94', 18),
      },
      {
        ...TEST_BOOSTED_POOL_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x7fffff9bf5f2a0b5bec073371029', 18),
      },
    ],
    amp: '300',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),

    swapFee: BigDecimal.from('0x5af3107a4000', 18),
    totalShares: BigDecimal.from('0x640a0d5f4a413f8cc8efd7', 18),
    totalLiquidity: BigDecimal.from('0x644bf508d567514c85450a', 18),
    totalSwapFee: BigDecimal.from('0x13dc5cacad2020324e', 18),
    totalSwapVolume: BigDecimal.from('0x0307cfe4192ab6e9ad27a5', 18),
    displayName: '2pool Stable Pool',
  },
  {
    id: '0x6ea0086d318afe79858097409f848521f2c83ee200010000000000000000001b',
    address: '0x6ea0086d318afe79858097409f848521f2c83ee2',
    name: 'Hadouken Boosted TriCrypto 2 Weighted Pool',
    symbol: 'HDK-Boosted-CKB-ETH-USD',
    decimals: 18,
    poolType: PoolType.WeightedBoosted,
    tokens: [
      {
        ...TEST_BOOSTED_POOL_TOKEN,
        weight: BigDecimal.from('0x04b7ec32d7a20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x1bc16d674ec80000', 18),
      },
      {
        ...TEST_LNR_ETH_TOKEN,
        weight: BigDecimal.from('0x0494654067e10000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x1bc16d674ec80000', 18),
      },
      {
        ...TEST_LNR_CKB_TOKEN,
        weight: BigDecimal.from('0x0494654067e10000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x1bc16d674ec80000', 18),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),

    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x53444835ec5540a1', 18),
    totalLiquidity: BigDecimal.from('0x00', 18),
    totalSwapFee: BigDecimal.from('0x00', 18),
    totalSwapVolume: BigDecimal.from('0x00', 18),
    displayName: 'Hadouken Boosted TriCrypto 2 Weighted Pool',
  },
  {
    id: '0x76702e8e41b6ab07aea594e6ece17f1a23ce2fbe000200000000000000000003',
    address: '0x76702e8e41b6ab07aea594e6ece17f1a23ce2fbe',
    name: 'CKB/USDC Weighted Pool',
    symbol: 'HDK-CKB-USDC',
    decimals: 18,
    poolType: PoolType.Weighted,
    tokens: [
      {
        ...TEST_USDC_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0391bbfc167c', 6),
      },
      {
        ...TEST_CKB_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0197cdedee133e502036', 18),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),

    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x4886a107dde8924c9a02', 18),
    totalLiquidity: BigDecimal.from('0x067e12b290d071dea78000', 18),
    totalSwapFee: BigDecimal.from('0x0436b8d8b2c9a6b600', 18),
    totalSwapVolume: BigDecimal.from('0x057c9604d37691125000', 18),
    displayName: 'Hadouken Boosted CKB/USDC Weighted Pool',
  },
  {
    id: '0x9d47d7326b85956f2c483a578039c54af0cdb784000100000000000000000004',
    address: '0x9d47d7326b85956f2c483a578039c54af0cdb784',
    name: 'CKB/WBTC/ETH Weighted Pool',
    symbol: 'HDK-CKB-WBTC-ETH',
    decimals: 18,
    poolType: PoolType.Weighted,
    tokens: [
      {
        ...TEST_CKB_TOKEN,
        weight: BigDecimal.from('0x04b7ec32d7a20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x4ccb18c960e4beb9', 18),
      },
      {
        ...TEST_WBTC_TOKEN,
        weight: BigDecimal.from('0x0494654067e10000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0ce9bf2fe7', 8),
      },
      {
        ...TEST_ETH_TOKEN,
        weight: BigDecimal.from('0x0494654067e10000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x1dedee1d0e050b2005', 18),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x12ac5e14ff30de4178', 18),
    totalLiquidity: BigDecimal.from('0x01cc2f5edbed824dcf09', 18),
    totalSwapFee: BigDecimal.from('0x01321b3d0f685570ec5f', 18),
    totalSwapVolume: BigDecimal.from('0x018e937781652f405e7232', 18),
    displayName: 'Hadouken Boosted CKB/WBTC/ETH Weighted Pool',
  },
  {
    id: '0xa996ed2c88ed9b207d39ab2ade42e963fe58bae2000000000000000000000013',
    address: '0xa996ed2c88ed9b207d39ab2ade42e963fe58bae2',
    name: 'Celer USD Stable Pool',
    symbol: 'HDK-Boosted-USD-ceUSDC-ceUSDT',
    decimals: 18,
    poolType: PoolType.ComposableStable,
    tokens: [
      {
        ...TEST_CELER_USDC_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0219aef2', 6),
      },
      {
        ...TEST_BOOSTED_POOL_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de7caf7b1f6c7f1', 18),
        balance: BigDecimal.from('0x016ad19bccadce7bca', 18),
      },
      {
        ...TEST_CELER_BOOSTED_POOL_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x7ffffffffffb4370eaf91deeb864', 18),
      },
      {
        ...TEST_CELER_USDT_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x018cb2af', 6),
      },
    ],
    amp: '300',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x5af3107a4000', 18),
    totalShares: BigDecimal.from('0x04bc8f1506e211479c', 18),
    totalLiquidity: BigDecimal.from('0x00', 18),
    totalSwapFee: BigDecimal.from('0x03e35a9cd6b6d5', 18),
    totalSwapVolume: BigDecimal.from('0x97e1038e8345f554', 18),
    displayName: 'Celer USD Stable Pool',
  },
  {
    id: '0xa99dfda7c245d17a6f6d6febf02443440d0022cd00000000000000000000000c',
    address: '0xa99dfda7c245d17a6f6d6febf02443440d0022cd',
    name: 'USDC|BSC Stable Pool',
    symbol: 'HDK-USDC',
    decimals: 18,
    poolType: PoolType.ComposableStable,
    tokens: [
      {
        ...TEST_USDC_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0769357771afbce966c9', 18),
      },
      {
        ...TEST_BOOSTED_POOL_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de7caf7b1f6c7f1', 18),
        balance: BigDecimal.from('0x403873d10e349268664b', 18),
      },
      {
        ...TEST_USDC_BSC_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x7fffffffb892328f450c50e5e1b5', 18),
      },
    ],
    amp: '300',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),

    swapFee: BigDecimal.from('0x5af3107a4000', 18),
    totalShares: BigDecimal.from('0x476dcd70baf3af1a1e4b', 18),
    totalLiquidity: BigDecimal.from('0x00', 18),
    totalSwapFee: BigDecimal.from('0x10f306233d1be5b9', 18),
    totalSwapVolume: BigDecimal.from('0x0296151fc08311bd9950', 18),
    displayName: 'USDC|BSC Stable Pool',
  },
  {
    id: '0xaf4ea576c3f63446d0dc9ee4988cd08b51a7d597000000000000000000000015',
    address: '0xaf4ea576c3f63446d0dc9ee4988cd08b51a7d597',
    name: 'Linear ETH',
    symbol: 'HDK-LNR-ETH',
    decimals: 18,
    poolType: PoolType.AaveLinear,
    tokens: [
      {
        ...TEST_H_ETH_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0579a814e10a740000', 18),
      },
      {
        ...TEST_LNR_ETH_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0xfffffffffff9ba6fdc64d382fccf', 18),
      },
      {
        ...TEST_ETH_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0xcbe808bbd3adb2fb', 18),
      },
    ],
    amp: '',
    owner: '',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x05543df729c000', 18),
    totalShares: BigDecimal.from('0x064590239b2c7d0330', 18),
    totalLiquidity: BigDecimal.from('0x054d0ec6749b37326c64', 18),
    totalSwapFee: BigDecimal.from('0x00', 18),
    totalSwapVolume: BigDecimal.from('0x00', 18),
    displayName: 'Linear ETH',
  },
  {
    id: '0xb8e6cfbdffecf3ef086aad22cad9f653bbd80fd5000000000000000000000014',
    address: '0xb8e6cfbdffecf3ef086aad22cad9f653bbd80fd5',
    name: 'Linear CKB',
    symbol: 'HDK-LNR-CKB',
    decimals: 18,
    poolType: PoolType.AaveLinear,
    tokens: [
      {
        ...TEST_CKB_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0xdc62d64f24a46f0efb', 18),
      },
      {
        ...TEST_LNR_CKB_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0xffffffffff1e68e52d7c9610f104', 18),
      },
      {
        ...TEST_H_CKB_TOKEN,
        weight: BigDecimal.from(0, 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x053444835ec5800000', 18),
      },
    ],
    amp: '',
    owner: '',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x05543df729c000', 18),
    totalShares: BigDecimal.from('0xe1971ad28369ef0efb', 18),
    totalLiquidity: BigDecimal.from('0x01cbb6ff8745dd2092ca7e', 18),
    totalSwapFee: BigDecimal.from('0x364c7979501438b7', 18),
    totalSwapVolume: BigDecimal.from('0x8d6727014089fe5d7b', 18),
    displayName: 'Linear CKB',
  },
  {
    id: '0xccb39a5423a517caa7ddcdfcb56d3087fb4251da000200000000000000000005',
    address: '0xccb39a5423a517caa7ddcdfcb56d3087fb4251da',
    name: 'CKB/WBTC Weighted Pool',
    symbol: 'HDK-CKB-WBTC',
    decimals: 18,
    poolType: PoolType.Weighted,
    tokens: [
      {
        ...TEST_CKB_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x015023d5b70b8c184c', 18),
      },
      {
        ...TEST_WBTC_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x01747d736285', 8),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x435da8128c6f815eaf', 18),
    totalLiquidity: BigDecimal.from('0x0559a17ba70a52f7f78f', 18),
    totalSwapFee: BigDecimal.from('0x108e73d664f0a057aa', 18),
    totalSwapVolume: BigDecimal.from('0x158ed17f28c3fb72257f', 18),
    displayName: 'CKB/WBTC Weighted Pool',
  },
  {
    id: '0xdc3d6c5cf473d2f0d93d112bd8a10b603ccabd5d00020000000000000000000f',
    address: '0xdc3d6c5cf473d2f0d93d112bd8a10b603ccabd5d',
    name: 'BNB/USDC Weighted Pool',
    symbol: 'HDK-BNB-USDC',
    decimals: 18,
    poolType: PoolType.Weighted,
    tokens: [
      {
        ...TEST_USDC_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x031e585accdb', 6),
      },
      {
        ...TEST_BNB_BINANCE_TOKEN,
        weight: BigDecimal.from('0x06f05b59d3b20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x0227c70ac0a063e4a50a46', 18),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x04e9fa07235057cdecacce', 18),
    totalLiquidity: BigDecimal.from('0x02dc340ddf745d66e96000', 18),
    totalSwapFee: BigDecimal.from('0x0453af79e561732e00', 18),
    totalSwapVolume: BigDecimal.from('0x05a24c7c0d56e34e9000', 18),
    displayName: 'BNB/USDC Weighted Pool',
  },
  {
    id: '0xf0ca75c9691e2d221c470bb4383e95aeb6906be000010000000000000000001a',
    address: '0xf0ca75c9691e2d221c470bb4383e95aeb6906be0',
    name: 'Hadouken Boosted TriCrypto Weighted Pool',
    symbol: 'HDK-Boosted-CKB-ETH-USDC',
    decimals: 18,
    poolType: PoolType.WeightedBoosted,
    tokens: [
      {
        ...TEST_LNR_USDC_TOKEN,
        weight: BigDecimal.from('0x04b7ec32d7a20000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x011fc845f8b48ead37', 18),
      },
      {
        ...TEST_LNR_ETH_TOKEN,
        weight: BigDecimal.from('0x0494654067e10000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0xb50611b067685744', 18),
      },
      {
        ...TEST_LNR_CKB_TOKEN,
        weight: BigDecimal.from('0x0494654067e10000', 18),
        priceRate: BigDecimal.from('0x0de0b6b3a7640000', 18),
        balance: BigDecimal.from('0x14fc82b7e212a3b0df', 18),
      },
    ],
    amp: '',
    owner: '0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b',
    createTime: new Date(),
    swapFee: BigDecimal.from('0x0aa87bee538000', 18),
    totalShares: BigDecimal.from('0x078dffd6ccbdb922f2', 18),
    totalLiquidity: BigDecimal.from('0x0dc9276250f9cb51c0', 18),
    totalSwapFee: BigDecimal.from('0x0c004ab54eee9f00', 18),
    totalSwapVolume: BigDecimal.from('0x0fa06146bec6b45e1a', 18),
    displayName: 'HDK-Boosted-CKB-ETH-USDC',
  },
]
