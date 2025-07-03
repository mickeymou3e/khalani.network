import {PriceRateCacheUpdated} from "../../../types/templates/MetaStablePool/MetaStablePool";

import {setPriceRateCache} from "../ComposableStablePool/TokenRateCacheUpdated";

export function handlePriceRateCacheUpdated(event: PriceRateCacheUpdated): void {
    setPriceRateCache(event.address, event.params.token, event.params.rate, event.block.timestamp);
}


