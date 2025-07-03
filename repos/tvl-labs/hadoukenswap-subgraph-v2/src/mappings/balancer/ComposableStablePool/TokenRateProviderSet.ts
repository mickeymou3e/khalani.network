import {Address, BigInt} from "@graphprotocol/graph-ts";

import {getPoolTokenId} from "../helpers/misc";

import {TokenRateProviderSet} from "../../../types/ComposableStablePoolFactory/ComposableStablePool";
import {MetaStablePool} from "../../../types/templates/StablePhantomPool/MetaStablePool";
import {Pool, PriceRateProvider} from "../../../types/schema";

import {ONE_BD} from "../helpers/constants";

export function loadPriceRateProvider(poolId: string, tokenAddress: Address): PriceRateProvider | null {
    return PriceRateProvider.load(getPoolTokenId(poolId, tokenAddress));
}

export function handleTokenRateProviderSet(event: TokenRateProviderSet): void {
    let poolContract = MetaStablePool.bind(event.address);
    let poolIdCall = poolContract.try_getPoolId();
    let poolId = poolIdCall.value.toHexString();
    let pool = Pool.load(poolId) as Pool;
    let token = pool.tokensList[event.params.tokenIndex.toI32()];
    let tokenAddress = Address.fromString(token.toHexString());

    setPriceRateProvider(
        event.address,
        tokenAddress,
        event.params.provider,
        event.params.cacheDuration,
        event.block.timestamp
    );
}

export function setPriceRateProvider(
    poolAddress: Address,
    tokenAddress: Address,
    providerAdress: Address,
    cacheDuration: BigInt,
    blockTimestamp: BigInt
): void {
    // TODO - refactor so pool -> poolId doesn't require call
    let poolContract = MetaStablePool.bind(poolAddress);
    let poolIdCall = poolContract.try_getPoolId();
    let poolId = poolIdCall.value;

    let provider = loadPriceRateProvider(poolId.toHexString(), tokenAddress);
    if (provider == null) {
        // Price rate providers and pooltokens share an ID
        let providerId = getPoolTokenId(poolId.toHexString(), tokenAddress);
        provider = new PriceRateProvider(providerId);
        provider.poolId = poolId.toHexString();
        provider.token = providerId;

        // Default to a rate of one, this should be updated in `handlePriceRateCacheUpdated` eventually
        provider.rate = ONE_BD;
        provider.lastCached = blockTimestamp.toI32();
        provider.cacheExpiry = blockTimestamp.toI32() + cacheDuration.toI32();
    }

    provider.address = providerAdress;
    provider.cacheDuration = cacheDuration.toI32();

    provider.save();
}