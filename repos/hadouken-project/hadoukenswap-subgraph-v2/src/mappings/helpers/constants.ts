import {
  Address,
  BigDecimal,
  BigInt,
  dataSource
} from '@graphprotocol/graph-ts'

import { assets } from './assets'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ProtocolFeeType {
  export const Swap = 0
  export const FlashLoan = 1
  export const Yield = 2
  export const Aum = 3
}

export const ZERO = BigInt.fromI32(0)
export const ONE = BigInt.fromI32(1)
export const ZERO_BD = BigDecimal.fromString('0')
export const ONE_BD = BigDecimal.fromString('1')
export const SWAP_IN = 0
export const SWAP_OUT = 1

export const ZERO_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export const MAX_TIME_DIFF_FOR_PRICING = BigInt.fromI32(600) // 10min

export let MAX_POS_PRICE_CHANGE = BigDecimal.fromString('1') // +100%
export let MAX_NEG_PRICE_CHANGE = BigDecimal.fromString('-0.5') // -50%%

export const MIN_POOL_LIQUIDITY = BigDecimal.fromString('2000')
export const MIN_SWAP_VALUE_USD = BigDecimal.fromString('1')

export let FX_AGGREGATOR_ADDRESSES = assets.fxAggregators
export let FX_TOKEN_ADDRESSES = assets.fxAssets

export let USD_STABLE_ASSETS = assets.stableAssets
export let PRICING_ASSETS = assets.stableAssets.concat(assets.pricingAssets)

class AddressByNetwork {
  public godwokenMainnet: string
  public godwokenTestnet: string
  public zkSyncTestnet: string
  public mantleTestnet: string
}

let network: string = dataSource.network()

let vaultAddressByNetwork: AddressByNetwork = {
  godwokenMainnet: '0x4F8BDF24826EbcF649658147756115Ee867b7D63',
  godwokenTestnet: '0x84B73B0f766dD97E9e05fa8702229819DE9cC13D',
  zkSyncTestnet: '0xF5E99BD85bCb0745458627F90a1f9eFaEA70f045',
  mantleTestnet: '0x3dB6e78a866c69eb37090edB73a5FbEBa5B5DC98'
}

function forNetwork(
  addressByNetwork: AddressByNetwork,
  network: string
): Address {
  if (network == 'godwoken-mainnet') {
    return Address.fromString(addressByNetwork.godwokenMainnet)
  } else if (network == 'godwoken-testnet') {
    return Address.fromString(addressByNetwork.godwokenTestnet)
  } else if (network == 'zksync-testnet') {
    return Address.fromString(addressByNetwork.zkSyncTestnet)
  } else if (network == 'mantle-testnet') {
    return Address.fromString(addressByNetwork.mantleTestnet)
  }

  throw Error('Wrong network')
}

export let VAULT_ADDRESS = forNetwork(vaultAddressByNetwork, network)
