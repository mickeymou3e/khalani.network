import { BigDecimal, BigInt, Address } from '@graphprotocol/graph-ts'
import assets from "./assets";

export let ZERO = BigInt.fromI32(0)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export const SWAP_IN = 0
export const SWAP_OUT = 1

export let ZERO_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
)

export let MIN_POOL_LIQUIDITY = BigDecimal.fromString('1');
export let MIN_SWAP_VALUE_USD = BigDecimal.fromString('1');

export let VAULT_ADDRESS = Address.fromString('{{contracts.Vault.address}}')


// PRICING_ASSETS must be sorted by order of preference
export let PRICING_ASSETS = assets.stableAssets.concat(assets.pricingAssets);
export let USD_STABLE_ASSETS: Address[] = assets.stableAssets
