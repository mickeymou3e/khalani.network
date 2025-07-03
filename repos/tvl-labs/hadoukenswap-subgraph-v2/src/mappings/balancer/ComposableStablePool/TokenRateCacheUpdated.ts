import {TokenRateCacheUpdated} from "../../../types/ComposableStablePoolFactory/ComposableStablePool";
import {MetaStablePool} from "../../../types/templates/MetaStablePool/MetaStablePool";
import {Pool} from "../../../types/schema";
import {Address, BigInt, log} from "@graphprotocol/graph-ts";
import {loadPoolToken, scaleDown} from "../helpers/misc";
import {loadPriceRateProvider} from "./TokenRateProviderSet";

export function handleTokenRateCacheUpdated(event: TokenRateCacheUpdated): void {
    let poolContract = MetaStablePool.bind(event.address);
    let poolIdCall = poolContract.try_getPoolId();
    let poolId = poolIdCall.value.toHexString();
    let pool = Pool.load(poolId) as Pool;
    let token = pool.tokensList[event.params.tokenIndex.toI32()];
    let tokenAddress = Address.fromString(token.toHexString());

    setPriceRateCache(event.address, tokenAddress, event.params.rate, event.block.timestamp);
}


export function setPriceRateCache(
    poolAddress: Address,
    tokenAddress: Address,
    rate: BigInt,
    blockTimestamp: BigInt
): void {
    // TODO - refactor so pool -> poolId doesn't require call
    let poolContract = MetaStablePool.bind(poolAddress);
    let poolIdCall = poolContract.try_getPoolId();
    let poolId = poolIdCall.value;

    let rateScaled = scaleDown(rate, 18);
    let provider = loadPriceRateProvider(poolId.toHexString(), tokenAddress);
    if (provider == null) {
        log.warning('Provider not found in handlePriceRateCacheUpdated: {} {}', [
            poolId.toHexString(),
            tokenAddress.toHexString(),
        ]);
    } else {
        provider.rate = rateScaled;
        provider.lastCached = blockTimestamp.toI32();
        provider.cacheExpiry = blockTimestamp.toI32() + provider.cacheDuration;

        provider.save();
    }

    // Attach the rate onto the PoolToken entity
    let poolToken = loadPoolToken(poolId.toHexString(), tokenAddress);
    if (poolToken == null) return;
    poolToken.priceRate = rateScaled;
    poolToken.save();
}