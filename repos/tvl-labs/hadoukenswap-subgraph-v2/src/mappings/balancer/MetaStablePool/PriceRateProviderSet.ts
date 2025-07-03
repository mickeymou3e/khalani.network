import {PriceRateProviderSet} from "../../../types/templates/MetaStablePool/MetaStablePool";

import {setPriceRateProvider} from "../ComposableStablePool/TokenRateProviderSet";

export function handlePriceRateProviderSet(event: PriceRateProviderSet): void {
    setPriceRateProvider(
        event.address,
        event.params.token,
        event.params.provider,
        event.params.cacheDuration,
        event.block.timestamp
    );
}